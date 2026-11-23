import { generateRegistrationOptions } from "@simplewebauthn/server";
import { userHandle } from "../../../lib/webauthn";

// Step 1 of adding a passkey: needs an admin session and CSRF token (see middleware/guard.ts).
export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event);
  const { rpID } = eventRelyingParty(event);
  const cfg = useAdminConfig();
  const options = await generateRegistrationOptions({
    rpName: "Portfolio admin",
    rpID,
    userName: cfg.username,
    userID: userHandle(cfg.username),
    attestationType: "none",
    excludeCredentials: useStore()
      .listPasskeys()
      .map((p) => ({ id: p.id })),
    authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
  });
  await session.update({ challenge: options.challenge });
  return options;
});
