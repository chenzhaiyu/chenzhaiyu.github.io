#!/bin/bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if [[ -x /opt/homebrew/opt/ruby/bin/ruby ]]; then
  export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
fi

preview_dir="$(mktemp -d -t chenzhaiyu-preview)"
preview_config="$preview_dir/config.yml"
trap 'rm -f "$preview_config"; rmdir "$preview_dir"' EXIT

# Keep preview independent of external feeds and notebook conversion.
ruby -ryaml -rdate -e '
  config = YAML.load_file(ARGV.fetch(0), permitted_classes: [Date, Time], aliases: true)
  overrides = {
    "external_sources" => [],
    "exclude" => (Array(config["exclude"]) + ["assets/jupyter/blog.ipynb"]).uniq
  }
  File.write(ARGV.fetch(1), YAML.dump(overrides))
' "$project_dir/_config.yml" "$preview_config"

if [[ "${1:-}" == "--build" ]]; then
  bundle exec jekyll build --config "$project_dir/_config.yml,$preview_config"
else
  bundle exec jekyll serve \
    --config "$project_dir/_config.yml,$preview_config" \
    --host 127.0.0.1 \
    --port 4000
fi
