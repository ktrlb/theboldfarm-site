import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailTemplate, formatEmailField, formatEmailMessage, generatePlainTextEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, why, message } = body;

    // Validate required fields
    if (!name || !email || !why || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Build email content
    const emailContent = `
      ${formatEmailField("Name", name)}
      ${formatEmailField("Email", email)}
      ${formatEmailField("Reason", why)}
      ${formatEmailMessage("Message", message)}
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: ["karlie@theboldfarm.com"],
      subject: `Contact Form: ${why}`,
      html: generateEmailTemplate({
        title: "New Contact Form Submission",
        content: emailContent,
      }),
      text: generatePlainTextEmail({
        title: "New Contact Form Submission",
        content: `Name: ${name}\nEmail: ${email}\nReason: ${why}\n\nMessage:\n${message}`,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

