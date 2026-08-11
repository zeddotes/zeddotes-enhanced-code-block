#!/usr/bin/env bash
# Deploy the staged WordPress plugin payload to WordPress.org SVN (trunk + tags/<version>).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Load local credentials (never commit .env).
if [[ -f "${ROOT}/.env" ]]; then
	set -a
	# shellcheck disable=SC1091
	. "${ROOT}/.env"
	set +a
fi

SVN_URL="${SVN_URL:-https://svn.wp-plugins.org/zeddotes-enhanced-code-block/}"
SVN_URL="${SVN_URL%/}/"

if [[ -z "${SVN_USERNAME:-}" || -z "${SVN_PASSWORD:-}" ]]; then
	echo "error: SVN_USERNAME and SVN_PASSWORD are required (set in .env or the environment)" >&2
	exit 1
fi

if ! command -v svn >/dev/null 2>&1; then
	echo "error: svn is not installed or not on PATH" >&2
	exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
	echo "error: rsync is not installed or not on PATH" >&2
	exit 1
fi

# shellcheck source=bin/stage-plugin.sh
. "${SCRIPT_DIR}/stage-plugin.sh"

SVN_DIR="${DIST_DIR}/.svn-workspace"
rm -rf "${SVN_DIR}"
mkdir -p "${SVN_DIR}"

svn_auth=(
	--non-interactive
	--no-auth-cache
	--username "${SVN_USERNAME}"
	--password "${SVN_PASSWORD}"
)

echo "Checking out SVN workspace from ${SVN_URL}"
svn checkout "${svn_auth[@]}" --depth immediates "${SVN_URL}" "${SVN_DIR}"
svn update "${svn_auth[@]}" --set-depth infinity "${SVN_DIR}/trunk"
svn update "${svn_auth[@]}" --set-depth immediates "${SVN_DIR}/tags"

# Sync staged runtime files into trunk (preserve .svn metadata).
rsync -a --delete --exclude=".svn" "${STAGE_DIR}/" "${SVN_DIR}/trunk/"

cd "${SVN_DIR}"

# Schedule new/missing paths; remove deleted paths from the working copy.
svn add "${svn_auth[@]}" --force trunk/* 2>/dev/null || true
while IFS= read -r path; do
	svn add "${svn_auth[@]}" --force "${path}"
done < <(svn status trunk | awk '/^\?/ {print $2}')

while IFS= read -r path; do
	svn delete "${svn_auth[@]}" "${path}"
done < <(svn status trunk | awk '/^!/ {print $2}')

if [[ -n "$(svn status trunk)" ]]; then
	echo "Committing trunk for ${VERSION}"
	svn commit "${svn_auth[@]}" -m "Release ${VERSION}" trunk
else
	echo "trunk already matches ${VERSION}; nothing to commit"
fi

TAG_URL="${SVN_URL}tags/${VERSION}"
if svn ls "${svn_auth[@]}" "${TAG_URL}" >/dev/null 2>&1; then
	echo "Tag tags/${VERSION} already exists — skipping tag create."
else
	echo "Creating tags/${VERSION}"
	svn copy "${svn_auth[@]}" -m "Tagging ${VERSION}" "${SVN_URL}trunk" "${TAG_URL}"
fi

rm -rf "${DIST_DIR}/.stage" "${SVN_DIR}"

echo "Deployed ${PLUGIN_SLUG} ${VERSION} to WordPress.org SVN."
