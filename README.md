# Ash Proxy

Ash Proxy is a self-hosted web proxy with a quiet, dark interface. It is based
on the [Nebula template](https://github.com/bruhwhyamiso-templates/Nebula-template)
and uses Ultraviolet, Osana, and Bare Server for proxied browsing.

## Run locally

Requirements: Node.js 22 and npm.

```sh
npm ci
npm start
```

Open `http://localhost:3000`. The default port can be changed with `PORT`.

## Deploy to Railway

1. Push this repository to GitHub.
2. In Railway, create or open a project and choose **Deploy from GitHub repo**.
3. Select `TECHYAko/ash-proxy` and the `main` branch.
4. Railway builds the included Dockerfile, starts the app, and checks `/health`.
5. In **Settings → Networking**, generate a public domain.

The app listens on Railway's `PORT` environment variable. No email or OTP
configuration is needed for the default public setup. If OTP verification is
enabled in `deployment.config.json`, configure its provider before deployment.

## License and attribution

This project is distributed under the GNU Affero General Public License v3.0
only. The original Nebula template and its copyright and license notices are
preserved in [`LICENSE`](LICENSE). This repository contains the corresponding
modified source for this deployment.

Upstream template: [bruhwhyamiso-templates/Nebula-template](https://github.com/bruhwhyamiso-templates/Nebula-template).
Proxy dependencies: [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet),
[Osana](https://github.com/NebulaServices/Osana), and
[Bare Server](https://github.com/tomphttp/bare-server-node).
