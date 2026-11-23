import { verifyAuthenticationResponse, type AuthenticationResponseJSON } from "@simplewebauthn/server";
import { newCsrfToken } from "../../../lib/auth";
import { clientKey } from "../../../lib/clientKey";
import { fromBase64Url } from "../../../lib/webauthn";

// Sign in with a passkey, step 2.
export default defineEventHandler(async (event) => {
  const key = clientKey({ forwardedFor: getHeader(event, "x-forwarded-for"), socketIp: getRequestIP(event), trustProxy: process.env.TRUST_PROXY === "true" });
  const gate = loginLimiter.attempt(key);
  if (!gate.allowed) {
    setHeader(event, "Retry-After", Math.ceil(gate.retryAfterMs / 1000));
    throw createError({ statusCode: 429, statusMessage: "Too many attempts. Try again later." });
  }

  const session = await getAdminSession(event);
  const body = (await readBody(event).catch(() => null)) as { response?: AuthenticationResponseJSON } | null;
  const expectedChallenge = session.data.challenge;
  const stored = body?.response?.id ? useStore().getPasskey(body.response.id) : undefined;
  if (!body?.response || !expectedChallenge || !stored) {
    setResponseStatus(event, 401);
    return { message: "Invalid passkey" };
  }
  await session.update({ challenge: undefined }); // single-use

  const { rpID, origin } = eventRelyingParty(event);
  try {
    const result = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: { id: stored.id, publicKey: fromBase64Url(stored.publicKey), counter: stored.counter, transports: stored.transports as never },
    });
    if (!result.verified) throw new Error("not verified");
    useStore().touchPasskey(stored.id, result.authenticationInfo.newCounter);
  } catch {
    setResponseStatus(event, 401);
    return { message: "Invalid passkey" };
  }

  loginLimiter.reset(key);
  await session.clear();
  const csrfToken = newCsrfToken();
  await session.update({ authenticated: true, csrf: csrfToken });
  return { csrfToken };
});
