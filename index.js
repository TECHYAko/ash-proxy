import express from "express";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";
import path from "node:path";

const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");
const PASSWORD = "acorn4life";
const AUTH_COOKIE_NAME = "ash_auth";
const AUTH_COOKIE_VALUE = "true";
const AUTH_TTL_SECONDS = 20;

function parseCookies(header = "") {
  const cookies = {};
  for (const rawPart of header.split(";")) {
    const part = rawPart.trim();
    if (!part) continue;
    const index = part.indexOf("=");
    const key = index === -1 ? part : part.slice(0, index);
    const value = index === -1 ? "" : part.slice(index + 1);
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  return cookies[AUTH_COOKIE_NAME] === AUTH_COOKIE_VALUE;
}

function requiresAuthentication(req) {
  if (req.path === "/health" || req.path === "/login" || req.path === "/logout") {
    return false;
  }

  if (
    req.path.startsWith("/assets/") ||
    req.path.startsWith("/uv/") ||
    req.path.startsWith("/resources/") ||
    req.path.startsWith("/bare/") ||
    req.path.startsWith("/service/") ||
    req.path === "/sw.js" ||
    req.path === "/favicon.ico"
  ) {
    return false;
  }

  return true;
}

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  if (!requiresAuthentication(req)) {
    return next();
  }

  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/login", (req, res) => {
  if (isAuthenticated(req)) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "static", "login.html"));
});

app.post("/login", (req, res) => {
  const submittedPassword = String(req.body?.password || "").trim();

  if (submittedPassword !== PASSWORD) {
    return res.status(401).json({ ok: false, message: "Incorrect password." });
  }

  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; Path=/; Max-Age=${AUTH_TTL_SECONDS}; SameSite=Lax`
  );
  res.json({ ok: true, redirectTo: "/" });
});

app.get("/logout", (_req, res) => {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
  );
  res.redirect("/login");
});

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/photography", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "search.html"));
});

app.get("/mathematics", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "play.html"));
});

app.get("/forest", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "widgetbot.html"));
});

app.get("/go", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "go.html"));
});

app.get("/settings", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "settings.html"));
});

app.get("/donate", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "donate.html"));
});

app.get("/ocean", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "apps.html"));
});

app.get("/404", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "static", "404.html"));
});

app.get("/*", (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect("/login");
  }

  res.redirect("/404");
});

// Bare Server
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Ash Proxy running at http://localhost:${PORT}`);
});

server.listen({
  port: PORT,
});
