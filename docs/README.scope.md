# reversed — iUseTools-inspired rebuild

Work folder only. Ignore sibling folders under `website/`.

**Inspiration (public product):** https://www.iusetools.site/

This is a **from-scratch rebuild** of a similar free, browser-based tools site (own code, own branding). Not a copy of iUseTools source, assets, or name.

## REA (installed)

REA MCP is registered for Cursor (`rea-agents@6.4.0`). Skill path: `~/.agents/skills/reverse-engineer-anything`.

**You must restart Cursor** (or reload MCP) once so the REA server appears.

Website analysis needs a Chrome-family browser with remote debugging. Hopper/Ghidra/IDA are **not** required for this work.

### Browser capture (when needed)

```bash
# macOS example — adjust Chrome path if needed
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/rea-iusetools-browser \
  https://www.iusetools.site/
```

Then ask the agent (with REA MCP live):

```text
Use REA against http://127.0.0.1:9222. Map page sections, routes, and client-side libs for the open iUseTools tab. Evidence only — we reimplement in this repo under our brand.
```

CLI smoke:

```bash
npx -y rea-agents@6.4.0 doctor --client cursor --json
```

## Scope

| In | Out |
| --- | --- |
| Feature list + UX flow from public pages | Copying their JS/CSS/WASM binaries |
| Own stack in this folder | Using name/logo “iUseTools” |
| Client-side / private-by-default tools | Scraping or redistributing their assets |

See `docs/TARGET.md` for the public feature inventory.
