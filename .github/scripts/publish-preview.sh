#!/usr/bin/env bash
# Publishes the website files of ONE branch to the "gh-pages" branch, so GitHub Pages
# can show every branch at a permanent address:
#
#   <site>/latest/        the branch that was pushed most recently
#   <site>/<branch>/      every branch, e.g. <site>/subbranch_v5/ and <site>/main/
#   <site>/               a small page that lists all the previews
#
# Needed environment variables:
#   REMOTE_URL   git address of the repository (with credentials when run on GitHub)
#   BRANCH_NAME  the branch being published
#   COMMIT_SHA   the commit being published
# Optional: SRC_DIR (folder with the website files, default ".")
set -euo pipefail

: "${REMOTE_URL:?REMOTE_URL is required}"
: "${BRANCH_NAME:?BRANCH_NAME is required}"
: "${COMMIT_SHA:?COMMIT_SHA is required}"
SRC_DIR="$(cd "${SRC_DIR:-.}" && pwd)"

SLUG="$(printf '%s' "$BRANCH_NAME" | sed 's/[^A-Za-z0-9._-]/-/g')"
[ "$SLUG" = "latest" ] && SLUG="branch-latest"
NOW="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SHORT="${COMMIT_SHA:0:7}"

publish_once() {
  local work site
  work="$(mktemp -d)"
  site="$work/site"

  # 1. Start from the current gh-pages branch (or create it the first time).
  if git ls-remote --exit-code --heads "$REMOTE_URL" gh-pages >/dev/null 2>&1; then
    git clone --quiet --depth 1 --branch gh-pages "$REMOTE_URL" "$site"
  else
    git init -q -b gh-pages "$site"
    git -C "$site" remote add origin "$REMOTE_URL"
  fi

  # 2. Replace this branch's folder (and "latest") with the new files.
  rm -rf "$site/$SLUG" "$site/latest"
  mkdir -p "$site/$SLUG"
  (cd "$SRC_DIR" && tar --exclude=.git --exclude=.github -cf - .) | (cd "$site/$SLUG" && tar -xf -)
  printf 'branch=%s\ncommit=%s\ntime=%s\n' "$BRANCH_NAME" "$SHORT" "$NOW" > "$site/$SLUG/preview-info.txt"
  cp -R "$site/$SLUG" "$site/latest"
  touch "$site/.nojekyll"

  # 3. Rebuild the list page at the root, newest first.
  local rows=""
  while IFS='|' read -r t name commit; do
    [ -n "$name" ] || continue
    rows="$rows<tr><td><a href=\"$name/\">$name</a></td><td>$commit</td><td>$t</td></tr>"
  done < <(
    for d in "$site"/*/; do
      n="$(basename "$d")"
      [ "$n" = "latest" ] && continue
      [ -f "$d/preview-info.txt" ] || continue
      printf '%s|%s|%s\n' "$(sed -n 's/^time=//p' "$d/preview-info.txt")" "$n" "$(sed -n 's/^commit=//p' "$d/preview-info.txt")"
    done | sort -r
  )
  cat > "$site/index.html" <<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Website previews</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f4f6f8; color: #0f1b27; margin: 0; }
    main { max-width: 760px; margin: 0 auto; padding: 40px 20px; }
    h1 { margin: 0 0 8px; border-bottom: 3px solid #e8740c; display: inline-block; padding-bottom: 6px; }
    .big { display: inline-block; margin: 20px 0 28px; padding: 14px 26px; background: #f58220; color: #1a0f05; font-weight: 700; border-radius: 6px; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #d6dee5; }
    th, td { text-align: left; padding: 10px 14px; border-top: 1px solid #d6dee5; font-size: 0.95rem; }
    a { color: #b04d00; font-weight: 600; }
    p { color: #56656f; }
  </style>
</head>
<body>
<main>
  <h1>Website previews</h1>
  <p>Every branch of the website, updated automatically each time it is pushed.</p>
  <a class="big" href="latest/">Open the latest version</a>
  <p>Latest: <strong>$BRANCH_NAME</strong> (commit $SHORT), published $NOW. Reload the page with Ctrl+Shift+R if you do not see the newest changes.</p>
  <table>
    <tr><th>Branch</th><th>Commit</th><th>Published (UTC)</th></tr>
    $rows
  </table>
</main>
</body>
</html>
HTML

  # 4. Commit and push. Returns non-zero if the push is refused (another run got there first).
  git -C "$site" config user.name "github-actions[bot]"
  git -C "$site" config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git -C "$site" add -A
  if git -C "$site" diff --cached --quiet; then
    echo "Nothing changed for $SLUG."
    rm -rf "$work"
    return 0
  fi
  git -C "$site" commit -q -m "Preview $SLUG @ $SHORT"
  git -C "$site" push -q origin gh-pages
  rm -rf "$work"
}

# If two branches are pushed at the same moment, the second push is refused: start over from the newest gh-pages.
for attempt in 1 2 3 4; do
  if publish_once; then
    echo "Published $SLUG ($SHORT) as /$SLUG/ and /latest/."
    exit 0
  fi
  echo "Push refused (attempt $attempt). Retrying..."
  sleep $((attempt * 3))
done
echo "Could not publish the preview." >&2
exit 1
