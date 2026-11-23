import { verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server";
import { toBase64Url } from "../../../lib/webauthn";

// Step 2: the browser's answer is checked against the challenge we issued, then the public key is stored.
export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const body = (await readBody(event).catch(() => null)) as { response?: RegistrationResponseJSON; name?: unknown } | null;
  const expectedChallenge = session.data.challenge;
  if (!body?.response || !expectedChallenge) throw createError({ statusCode: 400, statusMessage: "No passkey registration in progress" });
  await session.update({ challenge: undefined }); // a challenge is single-use

  const { rpID, origin } = eventRelyingParty(event);
  let verification;
  try {
    verification = await verifyRegistrationResponse({ response: body.response, expectedChallenge, expectedOrigin: origin, expectedRPID: rpID });
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Passkey could not be verified" });
  }
  if (!verification.verified) throw createError({ statusCode: 400, statusMessage: "Passkey could not be verified" });

  const { credential } = verification.registrationInfo;
  const name = (typeof body.name === "string" ? body.name.trim().slice(0, 60) : "") || `Passkey ${useStore().listPasskeys().length + 1}`;
  useStore().addPasskey({ id: credential.id, name, publicKey: toBase64Url(credential.publicKey), counter: credential.counter, transports: credential.transports ?? [] });
  return { ok: true };
});
