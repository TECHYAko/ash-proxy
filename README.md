# Ash Proxy

Ash Proxy is a self-hosted web proxy built from the
[Interstellar V4 template](https://github.com/bruhwhyamiso-templates/Interstellar-V4-template),
using Ultraviolet and Bare Server.

Search terms are routed through the proxy to DuckDuckGo. Google Analytics is
not included.

## Run locally

Requires Node.js 22 and npm.

```sh
npm ci
npm start
```

Open `http://localhost:3000`. Set `PORT` to use another port.

## Deploy to Railway

1. Push this repository to GitHub.
2. In Railway, create a project and choose **Deploy from GitHub repo**.
3. Select `TECHYAko/ash-proxy` and the `main` branch.
4. Railway builds the included Dockerfile and checks `/health`.
5. In **Settings → Networking**, generate a public domain.

## License and source

This project is licensed under the GNU Affero General Public License v3.
The Interstellar V4 template's license and notices are retained in [`LICENSE`](LICENSE).
The modified source for this deployment is available in this repository.

Upstream template: [bruhwhyamiso-templates/Interstellar-V4-template](https://github.com/bruhwhyamiso-templates/Interstellar-V4-template).
Proxy dependencies: [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet)
and [Bare Server](https://github.com/tomphttp/bare-server-node).
