#!/usr/bin/env bash
# Downloads mcp-publisher into the repository root and verifies its Sigstore
# signature against the registry's release workflow. Needs cosign.
set -euo pipefail
cd "$(dirname "$0")/.."

version="v1.8.7"
os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
archive="mcp-publisher_${os}_${arch}.tar.gz"
base="https://github.com/modelcontextprotocol/registry/releases/download/${version}"

curl --fail --silent --show-error --location --output "$archive" "$base/$archive"
curl --fail --silent --show-error --location --output "$archive.sigstore.json" "$base/$archive.sigstore.json"
cosign verify-blob \
  --bundle "$archive.sigstore.json" \
  --certificate-identity "https://github.com/modelcontextprotocol/registry/.github/workflows/release.yml@refs/tags/${version}" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  "$archive"
tar xzf "$archive" mcp-publisher
rm -f "$archive" "$archive.sigstore.json"
./mcp-publisher --version
