# Ash Proxy

Ash Proxy is a web proxy with a clean, dark interface and a choice of proxy engines. It is a community-maintained redesign and fork of [Interstellar](https://github.com/InterstellarNetwork/Interstellar). The upstream license is retained; see [LICENSE](LICENSE).

> Only deploy this service for your own use or for users you are authorized to serve. Follow the laws, network policies, and terms that apply to your use.

## Run locally

**Requirements:** Node.js 22 and pnpm 10 (Corepack can install the pnpm version pinned in `package.json`).

1. Install dependencies:

   ```sh
   corepack enable
   pnpm install --frozen-lockfile
   ```

2. Create a local environment file and set a private username and password. In PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Generate a password (for example, `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`), then set it in `.env`. Passwords shorter than 16 characters are rejected. Do not commit this file.

3. Build the proxy assets and start the service:

   ```sh
   pnpm build
   pnpm start
   ```

4. Open `http://localhost:8080`. The browser will request the configured Basic Auth credentials. `/health` returns a small unauthenticated health-check response.

Run `pnpm build` after changing frontend assets. The start command serves `dist/` when the build output is available and otherwise falls back to `static/`.

## Deploy to Render (recommended)

Ash Proxy needs a Node server that can keep proxy transport connections open. Render's Docker web service is the recommended starting point; the repository includes a `Dockerfile` and `render.yaml`.

1. Push this repository to a GitHub account you control.
2. In Render, choose **New > Blueprint**, connect the repository, and apply the `render.yaml` blueprint. Alternatively, create a **Web Service** using the Docker runtime and this repository's `Dockerfile`.
3. Set `ASH_PROXY_USERNAME` and `ASH_PROXY_PASSWORD` as secret environment variables in the Render service settings. Do not use the example password.
4. Deploy and wait for the `/health` check to pass. Open the generated `onrender.com` URL and authenticate in your browser.
5. For dependable long-lived proxy connections, select an always-on plan. Free instances may sleep or restart, which interrupts active sessions.

The container builds the frontend during image creation, binds to `0.0.0.0` on the host-provided `PORT` (default `8080`), and runs as the unprivileged `node` user.

Railway, Fly.io, or another persistent Node/Docker host can use the same Dockerfile. Configure the two credentials as secrets and allow inbound HTTPS and WebSocket traffic. If the host requires a port, use the `PORT` value it provides.

## Deploy to Vercel

Vercel Functions added WebSocket support in public beta in 2026. This repository's `vercel.json` exports the Node HTTP server as the function entry point so both HTTP requests and WebSocket upgrades can be routed. It can be used for testing or lighter usage, but a persistent Node service remains the simpler choice for long-running proxy sessions.

1. Push the repository to GitHub and import it in Vercel.
2. Use Node.js 22. Let Vercel detect pnpm from `package.json`/`pnpm-lock.yaml`; use `pnpm install --frozen-lockfile` for the install command and `pnpm build` for the build command. Do not set a static output directory.
3. In **Project Settings > Environment Variables**, add `ASH_PROXY_USERNAME` and `ASH_PROXY_PASSWORD` for the Production environment (and Preview only if you intend to expose preview deployments). Use a unique strong password.
4. Confirm **Fluid Compute** is enabled, then deploy. On projects created before Fluid Compute became the default, enable it in the project's Functions settings and redeploy.
5. Open the deployed URL, authenticate, and try both a regular proxied page and a site that uses WebSocket transport. Review the Vercel function and WebSocket logs if transport does not connect.

WebSocket support is still a Vercel public beta and connections end when the function reaches its configured maximum duration. The checked-in configuration sets a 300-second maximum; platform plan limits and pricing apply. Test reconnect behavior and usage before relying on Vercel for continuous sessions. See Vercel's [WebSocket guide](https://vercel.com/docs/functions/websockets), [Function limits](https://vercel.com/docs/functions/limitations), and [WebSocket support announcement](https://vercel.com/changelog/websocket-support-is-now-in-public-beta).

## Use Cloudflare

Cloudflare Pages and Workers are not drop-in hosts for this Node/Express application. Workers supports WebSockets, but deploying Ash Proxy directly there would require porting the server and its Node-oriented proxy dependencies to the Workers runtime.

To use Cloudflare with a supported host:

1. Deploy Ash Proxy to Render, Railway, Fly.io, or another persistent Node host first.
2. Add a custom domain to that host using its instructions.
3. In Cloudflare DNS, add the DNS record pointing the custom hostname to the host's target. Enable Cloudflare proxying only after the origin hostname and TLS configuration are correct.
4. Set SSL/TLS to **Full (strict)**, ensure WebSockets are enabled in **Network**, and avoid caching authenticated pages or proxy/upgrade traffic. Retest the `/health` endpoint, Basic Auth, and WebSocket transports through the custom domain.

Cloudflare Tunnel is another option when the Node service runs on a machine you control: run `cloudflared` on that machine and route a hostname to the local service port. Keep that machine online and protect the origin; a tunnel does not replace Ash Proxy's own login.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `ASH_PROXY_USERNAME` | Yes | Basic Auth username. |
| `ASH_PROXY_PASSWORD` | Yes | Basic Auth password. |
| `PORT` | Host-dependent | HTTP listen port; defaults to `8080`. |
| `ASH_PROXY_ALLOW_PRIVATE_IPS` | No | Set to `true` only for a trusted private deployment that intentionally needs proxy access to private/loopback addresses. Off by default. |
| `MASQR_SEARCH_TRIGGER` | No | Optional trigger for the Masqr gate when that feature is enabled in `config.js`. |

The server refuses to start when either credential is missing, and it never prints credentials to logs. Basic Auth protects both HTTP routes and proxy WebSocket upgrades. `/health` is intentionally public for platform health checks; it does not disclose configuration.

Private and loopback IP targets are blocked by default to reduce the risk of a public proxy being used to reach internal services. Do not enable `ASH_PROXY_ALLOW_PRIVATE_IPS` on an internet-facing deployment.

Optional Masqr token data is stored under `data/masqr.json`; the default configuration leaves Masqr disabled. If you enable it on a host with an ephemeral filesystem, configure persistent storage or expect its state to be lost after restarts.

## License and attribution

Ash Proxy is derived from Interstellar and keeps the upstream GNU Affero General Public License v3 or later in [LICENSE](LICENSE). Source changes and redistribution must comply with that license and preserve applicable notices.
