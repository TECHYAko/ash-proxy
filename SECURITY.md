# Security Policy

## Reporting a vulnerability

Please report security issues privately through [GitHub Security Advisories](https://github.com/TECHYAko/ash-proxy/security/advisories/new). Do not include credentials, tokens, or other secrets in a public issue.

## Deployment guidance

- Set both `ASH_PROXY_USERNAME` and `ASH_PROXY_PASSWORD` to unique values. The server will not start without them.
- Keep `.env` and deployment secrets out of source control and build logs.
- Leave `ASH_PROXY_ALLOW_PRIVATE_IPS` unset on public deployments.
- Keep the Node.js runtime and dependencies updated.
- Restrict access to the proxy to users you are authorized to serve.
