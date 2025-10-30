import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getRequiredEnv } from "@/lib/env";
import {
  // confirmationEmail,
  adminNotificationEmail,
} from "@/lib/email/templates";

const bodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      const issues = parsed.error.flatten();
      return NextResponse.json(
        {
          message: "Validation failed",
          fieldErrors: issues.fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    const apiKey = getRequiredEnv("RESEND_API_KEY");
    const toAddress = getRequiredEnv("CONTACT_TO_EMAIL");

    const resend = new Resend(apiKey);

    const firstName = name.split(" ")[0] || name;

    // Generate email templates
    // const confirmationHtml = confirmationEmail(firstName);
    const adminNotificationHtml = adminNotificationEmail(name, email, message);

    // Send confirmation email to sender
    // const { data: confirmData, error: confirmError } = await resend.emails.send({
    //   from: "Portfolio <onboarding@resend.dev>",
    //   to: [email],
    //   subject: "Thank you for contacting me — Message Received ✓",
    //   html: confirmationHtml,
    //   text: `Thank you for reaching out! I've received your message and will get back to you as soon as possible.`,
    // });

    // if (confirmError) {
    //   console.error("Resend confirmation email error:", confirmError);
    //   return NextResponse.json(
    //     { message: "Failed to send confirmation email", error: String(confirmError) },
    //     { status: 502 }
    //   );
    // }

    // Send admin notification email to your address
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: [toAddress],
      subject: `New contact message from ${name}`,
      replyTo: email,
      html: adminNotificationHtml,
      text: `New contact form submission from ${name} (${email}).\n\nMessage:\n${message}`,
    });

    if (adminError) {
      console.error("Resend admin notification error:", adminError);
      return NextResponse.json(
        {
          message: "Failed to send admin notification",
          error: String(adminError),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      //   confirmationId: confirmData?.id,
      notificationId: adminData?.id,
    });
  } catch (err) {
    console.error("/api/contact POST error:", err);
    return NextResponse.json(
      { message: "Unexpected server error" },
      { status: 500 }
    );
  }
}
