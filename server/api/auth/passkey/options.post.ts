import { generateAuthenticationOptions } from "@simplewebauthn/server";

// Sign in with a passkey, step 1: a fresh single-use challenge. It reveals nothing and checks nothing, so it is not
// rate limited (and must not touch the password limiter); every guess is counted in the verify step.
export default defineEventHandler(async (event) => {
  const { rpID } = eventRelyingParty(event);
  const options = await generateAuthenticationOptions({ rpID, userVerification: "preferred" });
  const session = await getAdminSession(event);
  await session.update({ challenge: options.challenge });
  return options;
});
