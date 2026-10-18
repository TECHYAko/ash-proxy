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

## Deploy to Railway (recommended)

Ash Proxy runs as a Node server and uses WebSockets for proxy traffic. A persistent Docker service is a better fit for that workload than a serverless function. Railway can build the repository's root `Dockerfile` directly from GitHub; no Railway CLI or config file is required.

> Before deploying, check Railway's current acceptable-use rules for web proxies. A working build does not guarantee that a provider will permit or continue hosting a proxy service.

1. Push this repository to GitHub. In Railway, create an account and choose **New Project > Deploy from GitHub repo**. Connect GitHub if asked, then select `TECHYAko/ash-proxy` and the `techyako-ash-proxy-redesign` branch (or the branch containing your changes).
2. Select the service Railway creates. In its **Settings**, confirm the **Root Directory** is `/` or blank so Railway can find the root `Dockerfile`. Railway should report that it detected and is using the Dockerfile. Do not enter a separate build or start command: the Dockerfile installs dependencies, builds the app, and starts the Node server.
3. Open the service's **Variables** tab and add these two variables:
   - `ASH_PROXY_USERNAME` — choose a username.
   - `ASH_PROXY_PASSWORD` — use a unique password at least 16 characters long.

   Save the variables and deploy the staged changes if Railway asks. Do not put credentials in GitHub or share them in chat. A deployment started before the variables exist can fail its first startup; adding them and redeploying is expected.
4. In **Settings**, configure the health check path as `/health`, then deploy. The server listens on Railway's provided `PORT`, and `/health` returns a public `200` response for the platform check.
5. After the deployment succeeds, go to **Settings > Networking > Public Networking** and select **Generate Domain**. Open the resulting `.railway.app` address. The browser should prompt for the username and password you set in step 3.
6. Verify the public `/health` URL returns `{"status":"ok"}`, then sign in and test a proxied page. WebSocket proxy sessions can still disconnect during restarts, redeploys, or provider incidents.

Railway's pricing and usage limits apply. Review them before exposing the service publicly. The Docker image uses Node 22, builds frontend assets during image creation, and runs as the unprivileged `node` user.

## Other deployment options

### Render

The repository also includes a `render.yaml` blueprint. In Render, create a Blueprint from the GitHub repository, select the branch with your changes, set `ASH_PROXY_USERNAME` and `ASH_PROXY_PASSWORD` in the service's environment settings, and deploy. Render free instances may sleep or restart and interrupt active proxy sessions. Use this option only if your Render account is active and the provider permits your intended use.

### Vercel (experimental)

The repository includes a Vercel configuration, and Vercel WebSocket support is in public beta. However, Ash Proxy needs a running Node server for its WebSocket proxy traffic, and serverless function limits can interrupt connections. Treat Vercel as experimental for this application, not the recommended beginner deployment path.

The checked-in config routes requests to the Node server and sets a 300-second maximum function duration, but that does not guarantee the function will start or keep proxy connections alive. See Vercel's [WebSocket guide](https://vercel.com/docs/functions/websockets) and [Function limits](https://vercel.com/docs/functions/limitations).

## Use Cloudflare

Cloudflare Pages and Workers are not drop-in hosts for this Node/Express application. Workers supports WebSockets, but deploying Ash Proxy directly there would require porting the server and its Node-oriented proxy dependencies to the Workers runtime.

To use Cloudflare with a supported host:

1. Deploy Ash Proxy to Railway or another persistent Node host first.
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
