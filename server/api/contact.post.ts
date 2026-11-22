import { Resend } from "resend";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default defineEventHandler(async (event) => {
  try {
    const json = await readBody(event).catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      setResponseStatus(event, 400);
      return {
        message: "Validation failed",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      };
    }

    const { name, email, message } = parsed.data;

    const { resendApiKey, contactToEmail } = useRuntimeConfig(event);
    if (!resendApiKey) {
      throw new Error("Missing required environment variable: NUXT_RESEND_API_KEY");
    }
    if (!contactToEmail) {
      throw new Error("Missing required environment variable: NUXT_CONTACT_TO_EMAIL");
    }

    const resend = new Resend(resendApiKey);

    // Send admin notification email to your address
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: [contactToEmail],
      subject: `New contact message from ${name}`,
      replyTo: email,
      html: adminNotificationEmail(name, email, message),
      text: `New contact form submission from ${name} (${email}).\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend admin notification error:", error);
      setResponseStatus(event, 502);
      return {
        message: "Failed to send admin notification",
        error: String(error),
      };
    }

    return { ok: true, notificationId: data?.id };
  } catch (err) {
    console.error("/api/contact POST error:", err);
    setResponseStatus(event, 500);
    return { message: "Unexpected server error" };
  }
});
