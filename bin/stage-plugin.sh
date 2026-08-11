#!/usr/bin/env bash
# Build and stage the WordPress.org runtime payload under dist/.stage/<slug>/.
# Sourced by package-plugin.sh and deploy-svn.sh (do not exec as a standalone entrypoint).
# Sets: ROOT, PLUGIN_SLUG, VERSION, DIST_DIR, STAGE_DIR

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_SLUG="zeddotes-enhanced-code-block"
VERSION="$(node -p "require('${ROOT}/package.json').version")"
DIST_DIR="${ROOT}/dist"
STAGE_DIR="${DIST_DIR}/.stage/${PLUGIN_SLUG}"

cd "${ROOT}"

# Prefer nvm locally; CI uses actions/setup-node.
if [[ -z "${CI:-}" && -s "${HOME}/.nvm/nvm.sh" ]]; then
	# shellcheck source=/dev/null
	. "${HOME}/.nvm/nvm.sh"
	nvm use
fi

if [[ ! -d node_modules ]]; then
	if [[ -n "${CI:-}" ]]; then
		npm ci
	else
		npm install
	fi
fi

npm run build

if [[ ! -f build/index.js || ! -f build/view.js || ! -f build/index.asset.php || ! -f build/view.asset.php ]]; then
	echo "error: build output missing required assets" >&2
	exit 1
fi

# Shared styles may land on either entry depending on imports.
if [[ ! -f build/style-view.css && ! -f build/style-index.css ]]; then
	echo "error: build output missing style-*.css" >&2
	exit 1
fi

rm -rf "${DIST_DIR}/.stage"
mkdir -p "${STAGE_DIR}"

# Runtime payload only — matches WP upload / WordPress.org trunk expectations.
cp "${ROOT}/zeddotes-enhanced-code-block.php" "${STAGE_DIR}/"
cp "${ROOT}/readme.txt" "${STAGE_DIR}/"
cp "${ROOT}/LICENSE" "${STAGE_DIR}/"
cp -R "${ROOT}/build" "${STAGE_DIR}/build"

# Drop source maps and junk if present.
find "${STAGE_DIR}" -name '*.map' -delete
find "${STAGE_DIR}" -name '.DS_Store' -delete
