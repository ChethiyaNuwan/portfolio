#!/usr/bin/env bash
# Smoke test for admin auth. Usage: BASE=http://localhost:3222 ADMIN_USERNAME=.. ADMIN_PASSWORD=.. scripts/smoke-auth.sh
# NOTE: trips the login lockout at the end — restart the server before running again.
set -u
BASE=${BASE:-http://localhost:3222}; U=${ADMIN_USERNAME:?}; PW=${ADMIN_PASSWORD:?}
JAR=$(mktemp); FAIL=0
ok()  { echo "PASS: $1"; }
bad() { echo "FAIL: $1"; FAIL=1; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
json='-H content-type:application/json'

[ "$(code $BASE/api/admin/content)" = 401 ] && ok "admin api without session → 401" || bad "admin api without session → 401"

HDRS=$(curl -si -c $JAR $json -d "{\"username\":\"$U\",\"password\":\"$PW\"}" $BASE/api/auth/login)
echo "$HDRS" | head -1 | grep -q 200 && ok "good login → 200" || bad "good login → 200"
echo "$HDRS" | grep -i '^set-cookie' | grep -qi 'httponly' && echo "$HDRS" | grep -i '^set-cookie' | grep -qi 'samesite=strict' && ok "cookie HttpOnly+SameSite=Strict" || bad "cookie flags"
TOKEN=$(echo "$HDRS" | grep -o '[0-9a-f]\{64\}' | tail -1)
[ ${#TOKEN} = 64 ] && ok "login returns csrf token" || bad "login returns csrf token"

[ "$(code -b $JAR $BASE/api/auth/session)" = 200 ] && ok "session endpoint 200" || bad "session endpoint"
[ "$(code -b $JAR -X PUT $json -d '[]' $BASE/api/admin/content/faq)" = 403 ] && ok "write without csrf → 403" || bad "write without csrf → 403"
[ "$(code -b $JAR -X PUT -H 'x-csrf-token: nope' $json -d '[]' $BASE/api/admin/content/faq)" = 403 ] && ok "write with wrong csrf → 403" || bad "wrong csrf → 403"

H=$(curl -sI $BASE/admin/login)
echo "$H" | grep -qi 'x-robots-tag: noindex' && ok "/admin noindex header" || bad "/admin noindex header"
echo "$H" | grep -qi 'x-frame-options: DENY' && ok "x-frame-options" || bad "x-frame-options"

B1=$(curl -s $json -d "{\"username\":\"nobody\",\"password\":\"$PW\"}" $BASE/api/auth/login)
B2=$(curl -s $json -d "{\"username\":\"$U\",\"password\":\"wrong-password-xx\"}" $BASE/api/auth/login)
[ "$B1" = "$B2" ] && echo "$B1" | grep -q 'Invalid credentials' && ok "wrong user and wrong pass → identical body" || bad "identical failure body ($B1 vs $B2)"
for i in 1 2 3; do curl -s -o /dev/null $json -d '{"username":"x","password":"y"}' $BASE/api/auth/login; done
[ "$(code $json -d '{"username":"x","password":"y"}' $BASE/api/auth/login)" = 429 ] && ok "6th failure → 429" || bad "lockout 429"

rm -f $JAR; exit $FAIL
