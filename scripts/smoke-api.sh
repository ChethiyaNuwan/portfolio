#!/usr/bin/env bash
# Smoke test for content API + CV. Usage: BASE=http://localhost:3222 ADMIN_USERNAME=.. ADMIN_PASSWORD=.. scripts/smoke-api.sh
set -u
BASE=${BASE:-http://localhost:3222}; U=${ADMIN_USERNAME:?}; PW=${ADMIN_PASSWORD:?}
JAR=$(mktemp); FAIL=0
ok()  { echo "PASS: $1"; }
bad() { echo "FAIL: $1"; FAIL=1; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
J='content-type: application/json'

TOKEN=$(curl -s -c $JAR -H "$J" -d "{\"username\":\"$U\",\"password\":\"$PW\"}" $BASE/api/auth/login | grep -o '[0-9a-f]\{64\}')
H="x-csrf-token: $TOKEN"
put() { curl -s -w '\n%{http_code}' -b $JAR -X PUT -H "$H" -H "$J" -d "$2" "$BASE/api/admin/content/$1"; }

curl -s $BASE/api/content | grep -q '"settings"' && bad "public content must not expose settings" || ok "public content has no settings"
curl -s $BASE/api/content | grep -q '"Chethiya Nuwan"' && ok "public content seeded" || bad "public content seeded"
curl -s -b $JAR $BASE/api/admin/content | grep -q '"cvMode"' && ok "admin content includes settings" || bad "admin content includes settings"

OUT=$(put faq '[{"id":"a","question":"Edited question?","answer":"Edited."}]'); echo "$OUT" | tail -1 | grep -q 200 && ok "valid PUT → 200" || bad "valid PUT → 200 ($OUT)"
curl -s $BASE/api/content | grep -q 'Edited question?' && ok "edit visible publicly" || bad "edit visible publicly"

BEFORE=$(curl -s $BASE/api/content)
OUT=$(put projects '[{"id":"1","title":"t","description":"d","link":"l","type":"t","theme":"t","pages":"x","image":"i"}]'); echo "$OUT" | tail -1 | grep -q 400 && ok "invalid PUT → 400" || bad "invalid PUT → 400 ($OUT)"
[ "$BEFORE" = "$(curl -s $BASE/api/content)" ] && ok "invalid PUT leaves data unchanged" || bad "invalid PUT changed data"

OUT=$(put nonsense '[]'); echo "$OUT" | tail -1 | grep -q 404 && ok "unknown section → 404" || bad "unknown section → 404"
[ "$(code -b $JAR -X PUT -H "$J" -d '[]' $BASE/api/admin/content/faq)" = 403 ] && ok "PUT without csrf → 403" || bad "PUT without csrf → 403"
OUT=$(put settings '{"cvMode":"uploaded","cvUploadUrl":"/uploads/00000000-0000-0000-0000-000000000000.pdf"}'); echo "$OUT" | tail -1 | grep -q 400 && ok "settings pointing at missing pdf → 400" || bad "settings missing pdf → 400 ($OUT)"

# --- CV ---
TMP=$(mktemp -d)
curl -s $BASE/cv -o $TMP/gen1.pdf
head -c5 $TMP/gen1.pdf | grep -q '%PDF-' && ok "/cv serves a pdf (generated)" || bad "/cv generated pdf"

OUT=$(put settings '{"cvMode":"uploaded","cvUploadUrl":null}'); echo "$OUT" | tail -1 | grep -q 200 || bad "set uploaded mode without file ($OUT)"
curl -s $BASE/cv -o $TMP/fallback.pdf
cmp -s $TMP/gen1.pdf $TMP/fallback.pdf && ok "uploaded mode without file falls back to generated" || bad "fallback to generated"

printf '%%PDF-1.4\n%% custom uploaded cv\n%%%%EOF\n' > $TMP/mine.pdf
URL=$(curl -s -b $JAR -H "$H" -F file=@$TMP/mine.pdf "$BASE/api/admin/upload?kind=pdf" | grep -o '/uploads/[^"]*')
[ -n "$URL" ] && ok "pdf upload accepted" || bad "pdf upload"
OUT=$(put settings "{\"cvMode\":\"uploaded\",\"cvUploadUrl\":\"$URL\"}"); echo "$OUT" | tail -1 | grep -q 200 && ok "settings → uploaded cv" || bad "settings uploaded ($OUT)"
curl -s $BASE/cv -o $TMP/served.pdf
cmp -s $TMP/mine.pdf $TMP/served.pdf && ok "/cv serves the uploaded file" || bad "/cv serves uploaded file"

put settings '{"cvMode":"generated","cvUploadUrl":null}' >/dev/null
curl -s $BASE/cv -o $TMP/gen2.pdf
OUT=$(put profile '{"name":"Chethiya Nuwan","title":"Edited Title Marker","intro":"intro text","email":"a@b.co","avatar":"/profile.jpg"}'); echo "$OUT" | tail -1 | grep -q 200 || bad "profile edit ($OUT)"
curl -s $BASE/cv -o $TMP/gen3.pdf
cmp -s $TMP/gen2.pdf $TMP/gen3.pdf && bad "content edit must change generated cv" || ok "content edit changes generated cv"

rm -rf $JAR $TMP; exit $FAIL
