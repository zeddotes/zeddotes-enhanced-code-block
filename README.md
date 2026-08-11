# Zeddotes Enhanced Code Block

[![CI](https://github.com/zeddotes/zeddotes-enhanced-code-block/actions/workflows/ci.yml/badge.svg)](https://github.com/zeddotes/zeddotes-enhanced-code-block/actions/workflows/ci.yml)
[![Release](https://github.com/zeddotes/zeddotes-enhanced-code-block/actions/workflows/release.yml/badge.svg)](https://github.com/zeddotes/zeddotes-enhanced-code-block/actions/workflows/release.yml)
[![License: GPL v2 or later](https://img.shields.io/badge/License-GPL%20v2%2B-blue.svg)](./LICENSE)

WordPress plugin that extends the core **Code** block (`core/code`) for technical authors — language-aware Prism highlighting, line numbers, tab/indent controls, and a configurable copy button.

No separate block type. Authors keep inserting the standard Code block; Zeddotes Enhanced Code Block adds a **Zeddotes Enhanced Code Block** panel in the sidebar.

**Repository:** [github.com/zeddotes/zeddotes-enhanced-code-block](https://github.com/zeddotes/zeddotes-enhanced-code-block)

## Features

- Language select with Prism.js highlighting in the block editor and on the frontend
- Optional line numbers
- Tab stays inside the block and indents; Shift+Tab outdents
- Indent with spaces or tabs; tab size 2 / 4 / 8
- Optional copy button before or after the code block (left / center / right), or hidden
- Bundled Prism (no CDN, no remote calls)

## Requirements

- WordPress 6.0+
- PHP 7.4+
- Node 24+ (development / packaging only)

## Install (WordPress)

### From a release zip

1. Download `zeddotes-enhanced-code-block-*.zip` from [Releases](https://github.com/zeddotes/zeddotes-enhanced-code-block/releases).
2. In WP Admin → **Plugins → Add New → Upload Plugin**, upload the zip and activate **Zeddotes Enhanced Code Block**.
3. Edit a post, insert a **Code** block, open the **Zeddotes Enhanced Code Block** panel.

### From source

```bash
git clone https://github.com/zeddotes/zeddotes-enhanced-code-block.git
cd zeddotes-enhanced-code-block
nvm use
npm install
npm run build
```

Copy or symlink this directory into `wp-content/plugins/` (folder name can be `zeddotes-enhanced-code-block`), then activate the plugin.

## Development

```bash
nvm use
npm install
npm start          # watch build
```

| Script | Purpose |
|--------|---------|
| `npm start` | Development watch build |
| `npm run build` | Production assets into `build/` |
| `npm run package` | Build + WordPress upload zip in `dist/` |
| `npm run deploy:svn` | Build + deploy `trunk` / `tags/<version>` to WordPress.org SVN |
| `npm run release` | `package` then `deploy:svn` |

Packaging produces:

- `dist/zeddotes-enhanced-code-block-<version>.zip`
- `dist/zeddotes-enhanced-code-block.zip`

Zip layout matches WordPress upload expectations: one root folder `zeddotes-enhanced-code-block/` containing `zeddotes-enhanced-code-block.php`, `readme.txt`, `LICENSE`, and `build/`.

SVN deploy uses the same payload. Credentials: copy [`example.env`](./example.env) to `.env` (gitignored) and set `SVN_PASSWORD`.

## CI and releases

| Workflow | Trigger | What it does |
|----------|---------|----------------|
| [CI](.github/workflows/ci.yml) | Pull requests and pushes to `main` | `npm ci`, build, verify assets, package zip, upload artifact |
| [Release](.github/workflows/release.yml) | Push to `main` | If `v<package.json version>` does not exist yet: package zip, create GitHub Release, deploy to WordPress.org SVN |

To cut a new release: bump the version in `package.json`, `readme.txt` (`Stable tag` + changelog), and `zeddotes-enhanced-code-block.php`, open a PR, merge to `main`. The Release workflow tags `vX.Y.Z`, attaches the zip, and pushes `trunk` + `tags/X.Y.Z` to [plugins.svn.wordpress.org](https://svn.wp-plugins.org/zeddotes-enhanced-code-block/).

CI needs repository secrets `SVN_USERNAME` and `SVN_PASSWORD` (optional `SVN_URL`).

Local equivalent: `npm run release` with a filled `.env`.

Merges that do not change the version still run CI; they do not recreate an existing tag or redeploy SVN.

## Contributing

Collaboration is welcome.

- **Bugs and features:** open an issue using the templates — [New issue](https://github.com/zeddotes/zeddotes-enhanced-code-block/issues/new/choose)
- **Browse issues:** [Issues](https://github.com/zeddotes/zeddotes-enhanced-code-block/issues)
- **Pull requests:** fork, branch from `main`, keep changes focused, ensure CI passes

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, issue guidelines, and the release versioning rule.

## Project layout

```
zeddotes-enhanced-code-block.php  # Plugin bootstrap + asset enqueue
src/                              # Editor + frontend sources
build/                            # Compiled assets (generated)
bin/stage-plugin.sh               # Shared runtime staging for zip + SVN
bin/package-plugin.sh             # WordPress zip packager
bin/deploy-svn.sh                 # WordPress.org SVN deploy (trunk + tags)
readme.txt                        # WordPress.org readme
example.env                       # SVN credential template → .env
```

## License

GPL-2.0-or-later. See [LICENSE](./LICENSE).

Prism.js is MIT-licensed and bundled in the build.

## Author

[Zain Syed](https://github.com/zeddotes) ([@zeddotes](https://github.com/zeddotes))
