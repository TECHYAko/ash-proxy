import { existsSync, readFileSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import express from "express";
import basicAuth from "express-basic-auth";
import config from "../config.js";
import { mountGhGames } from "./games.js";
import { createBlockVerdict, setupFiltering } from "./filtering/index.js";
import { mountMasqr } from "./Masqr.js";
import { injectVersionInfo, resolveVersionInfo } from "./version.js";

console.log(chalk.yellow("🚀 Starting server..."));

const require = createRequire(import.meta.url);
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DIST_DIR = path.join(__dirname, "dist");
const STATIC_DIR = path.join(__dirname, "static");

const VENDOR_MAP_PATH = path.join(DIST_DIR, ".runtime", "vendor-map.cjs");
const vendorMap = existsSync(VENDOR_MAP_PATH) ? require(VENDOR_MAP_PATH) : null;

const SERVE_DIR = vendorMap ? DIST_DIR : STATIC_DIR;
console.log(chalk.blue(`Serving from ${path.relative(__dirname, SERVE_DIR)}/`));
if (vendorMap) {
  console.log(chalk.blue(`Build ${vendorMap.build}, proxy scope ${vendorMap.scopes.uv}, scramjet ${vendorMap.scopes.scramjet}`));
} else if (existsSync(DIST_DIR)) {
  console.log(chalk.yellow("dist/ exists but has no .runtime/vendor-map.cjs, run `pnpm build`. Falling back to static/."));
}

const server = http.createServer();
const app = express();

function resolvePort() {
  const args = process.argv.slice(2);
  let flag = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--port" || arg === "-p") flag = args[i + 1];
    else if (arg.startsWith("--port=")) flag = arg.slice("--port=".length);
    else continue;

    if (!/^\d+$/.test(flag ?? "") || Number(flag) < 1 || Number(flag) > 65535) {
      console.log(chalk.red(`Invalid port ${JSON.stringify(flag ?? null)}, expected 1-65535.`));
      process.exit(1);
    }
    break;
  }

  const port = flag ? Number(flag) : Number(process.env.PORT || 8080);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.log(chalk.red(`Invalid port ${JSON.stringify(process.env.PORT)}, expected 1-65535.`));
    process.exit(1);
  }
  return port;
}

const PORT = resolvePort();

if (
  config.challenge &&
  (Object.keys(config.users).length !== 1 || config.users[Object.keys(config.users)[0]].length < 16)
) {
  throw new Error("Set ASH_PROXY_USERNAME and an ASH_PROXY_PASSWORD of at least 16 characters before starting Ash Proxy.");
}

wisp.options.allow_loopback_ips = process.env.ASH_PROXY_ALLOW_PRIVATE_IPS === "true";
wisp.options.allow_private_ips = process.env.ASH_PROXY_ALLOW_PRIVATE_IPS === "true";

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const blockedSiteMatchers = config.blockedSites.map(host => new RegExp(`(^|\\.)${escapeRegExp(host.trim().toLowerCase())}$`, "i"));
wisp.options.hostname_blacklist = blockedSiteMatchers.length ? blockedSiteMatchers : null;

const filteringState = await setupFiltering({ wisp, filtering: config.filtering });
const blockVerdict = createBlockVerdict({ blocklist: blockedSiteMatchers, policy: filteringState.policy });

app.get("/health", (_req, res) => {
  res.set("Cache-Control", "no-store").json({ status: "ok" });
});

if (config.challenge) {
  console.log(chalk.green("🔒 Password protection is enabled."));
  app.use(basicAuth({ users: config.users, challenge: true }));
}

function isAuthenticated(req) {
  if (!config.challenge) return true;
  const match = /^Basic\s+([A-Za-z0-9+/]+={0,2})$/i.exec(req.headers.authorization ?? "");
  if (!match) return false;
  let decoded;
  try {
    decoded = Buffer.from(match[1], "base64").toString("utf8");
  } catch {
    return false;
  }
  const separator = decoded.indexOf(":");
  if (separator < 0) return false;
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  const [expectedUsername, expectedPassword] = Object.entries(config.users)[0];
  const safeEqual = (actual, expected) => {
    const actualBytes = Buffer.from(actual);
    const expectedBytes = Buffer.from(expected);
    return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
  };
  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

let masqr = null;
if (config.masqr?.enabled) {
  masqr = mountMasqr(app, {
    decoyRoot: path.join(STATIC_DIR, "decoy", config.masqr.decoy ?? "default"),
    searchTrigger: process.env.MASQR_SEARCH_TRIGGER ?? config.masqr.searchTrigger ?? null,
    secureCookie: config.masqr.secureCookie !== false,
    sessionMs: (config.masqr.sessionDays ?? 30) * 24 * 60 * 60 * 1000,
  });
  console.log(chalk.green("🔑 Masqr gate is enabled"));
}

mountGhGames(app);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jsStaticOptions = {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    if (ext === ".js" || ext === ".mjs") {
      res.type("text/javascript");
      res.setHeader("Service-Worker-Allowed", "/");
    } else if (ext === ".wasm") {
      res.type("application/wasm");
    }
    if (vendorMap && ext !== ".html") {
      res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else if (ext === ".html") {
      res.setHeader("Cache-Control", "no-cache");
    }
  },
};

app.use("/.runtime", (_req, res) => {
  res.sendStatus(404);
});

app.post("/filter/verdict", async (req, res) => {
  const host = typeof req.body?.host === "string" ? req.body.host.slice(0, 254) : "";
  res.set("Cache-Control", "no-store").json(await blockVerdict(host));
});

if (!vendorMap) {
  try {
    const info = await resolveVersionInfo();
    const settingsHtml = injectVersionInfo(readFileSync(path.join(SERVE_DIR, "settings.html"), "utf8"), info).html;
    const sendSettings = (_req, res) => res.type("html").send(settingsHtml);
    app.get("/settings", sendSettings);
    app.get("/settings.html", sendSettings);
  } catch (err) {
    console.warn(chalk.yellow(`Settings version injection skipped, serving placeholders: ${err.message}`));
  }
}

app.use(express.static(SERVE_DIR, { ...jsStaticOptions, dotfiles: "ignore" }));

if (!vendorMap) {
  const { epoxyPath } = require("@mercuryworkshop/epoxy-transport");
  const { baremuxPath } = require("@mercuryworkshop/bare-mux/node");
  const { libcurlPath } = require("@mercuryworkshop/libcurl-transport");
  const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
  const { scramjetPath } = require("@mercuryworkshop/scramjet/path");

  app.use("/epoxy/", express.static(epoxyPath));
  app.use("/libcurl/", express.static(libcurlPath));
  app.use("/baremux/", express.static(baremuxPath));
  app.use("/assets/ultraviolet/", express.static(uvPath, jsStaticOptions));
  app.use("/assets/scramjet/", express.static(scramjetPath, jsStaticOptions));
}

const routes = [
  { path: "/apps", file: "apps.html" },
  { path: "/games", file: "games.html" },
  { path: "/play.html", file: "games.html" },
  { path: "/settings", file: "settings.html" },
  { path: "/tabs", file: "tabs.html" },
  { path: "/home", file: "home.html" },
  { path: "/", file: "index.html" },
];

// In dist the build randomizes the page routes and records them in the vendor map, so serve each
// page at its opaque path (build id vendorMap.routes). "/" and "/play.html" have no entry and stay
// clean. In static/dev vendorMap is null, so the clean routes are used as-is.
routes.forEach(route => {
  const servePath = vendorMap?.routes?.[route.path] || route.path;
  const sendPage = (_req, res) => res.sendFile(path.join(SERVE_DIR, route.file));
  app.get(servePath, sendPage);
  if (servePath !== route.path) app.get(route.path, sendPage);
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(SERVE_DIR, "404.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(SERVE_DIR, "404.html"));
});

server.on("request", (req, res) => {
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (!isAuthenticated(req)) {
    return socket.end("HTTP/1.1 401 Unauthorized\r\nWWW-Authenticate: Basic realm=\"Ash Proxy\"\r\nConnection: close\r\n\r\n");
  }
  if (masqr && !masqr.isAuthorized(req)) return socket.destroy();
  wisp.routeRequest(req, socket, head);
});

server.on("listening", () => {
  console.log(chalk.green(`🌍 Server is running on http://localhost:${PORT}`));
});

if (process.env.VERCEL !== "1") server.listen({ port: PORT, host: "0.0.0.0" });

export default server;
