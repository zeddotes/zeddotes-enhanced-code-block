#!/usr/bin/env bash
# Build and zip Zeddotes Enhanced Code Block for WordPress Plugins → Upload Plugin.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=bin/stage-plugin.sh
. "${SCRIPT_DIR}/stage-plugin.sh"

ZIP_NAME="${PLUGIN_SLUG}-${VERSION}.zip"
ZIP_PATH="${DIST_DIR}/${ZIP_NAME}"

rm -f "${ZIP_PATH}" "${DIST_DIR}/${PLUGIN_SLUG}.zip"

(
	cd "${DIST_DIR}/.stage"
	zip -r "${ZIP_PATH}" "${PLUGIN_SLUG}" -x '*.DS_Store'
)

# Convenience alias without version for quick uploads.
cp "${ZIP_PATH}" "${DIST_DIR}/${PLUGIN_SLUG}.zip"

rm -rf "${DIST_DIR}/.stage"

echo "Created ${ZIP_PATH}"
echo "Also:   ${DIST_DIR}/${PLUGIN_SLUG}.zip"
echo
echo "Upload either zip via WP Admin → Plugins → Add New → Upload Plugin."
unzip -l "${ZIP_PATH}" | head -n 40
