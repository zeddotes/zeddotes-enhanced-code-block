# Contributing to Zeddotes Enhanced Code Block

Thanks for helping improve Zeddotes Enhanced Code Block. Collaboration is welcome — issues, discussions, and pull requests.

## Open an issue

Use GitHub Issues: [zeddotes/zeddotes-enhanced-code-block/issues](https://github.com/zeddotes/zeddotes-enhanced-code-block/issues)

- **Bug report** — unexpected behavior in the editor or on the frontend. Include WordPress version, theme, steps to reproduce, and screenshots when useful.
- **Feature request** — describe the authoring problem and how the feature would help. Check existing issues first to avoid duplicates.
- **Question** — usage or development questions are fine as issues if there is no discussion thread yet.

Please search open and closed issues before filing a new one.

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Keep changes focused; match existing code style.
3. Run `npm install` and `npm run build` locally; fix any build failures.
4. Open a PR against `main` with a clear description of *why* the change exists.
5. Link related issues (`Fixes #123`).

CI must pass on the PR before merge.

## Development setup

```bash
git clone https://github.com/zeddotes/zeddotes-enhanced-code-block.git
cd zeddotes-enhanced-code-block
nvm use
npm install
npm start
```

Symlink or copy the plugin into a local WordPress `wp-content/plugins/` directory and activate **Zeddotes Enhanced Code Block**.

## Releases

Version is defined in `package.json`. Keep these in sync on every bump:

- `package.json` → `"version"`
- `readme.txt` → `Stable tag` and `== Changelog ==`
- `zeddotes-enhanced-code-block.php` → plugin header `Version:` and `ZEDDOTES_ENHANCED_CODE_BLOCK_VERSION`

Merging to `main` with a **new** `package.json` version:

1. Creates a GitHub Release and attaches the WordPress-ready zip
2. Deploys the same runtime payload to WordPress.org SVN (`trunk/` + `tags/<version>/`)

Repository secrets required for SVN in CI: `SVN_USERNAME`, `SVN_PASSWORD` (optional `SVN_URL`).

Merges that do not bump the version still run CI but skip creating a duplicate release tag and skip SVN deploy.

### Local SVN publish

```bash
cp example.env .env   # set SVN_PASSWORD
nvm use
npm run release       # zip in dist/ + deploy trunk/tags
# or: npm run deploy:svn
```
