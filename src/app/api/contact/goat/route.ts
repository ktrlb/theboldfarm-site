import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailTemplate, formatEmailField, formatEmailMessage, emailDivider, generatePlainTextEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, goatId, goatName } = body;

    // Validate required fields
    if (!name || !email || !message || !goatId || !goatName) {
      return NextResponse.json(
        { error: "Name, email, message, goat ID, and goat name are required" },
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
      ${formatEmailField("Goat ID", goatId.toString())}
      ${formatEmailField("Goat Name", goatName)}
      ${emailDivider()}
      ${formatEmailField("Name", name)}
      ${formatEmailField("Email", email)}
      ${phone ? formatEmailField("Phone", phone) : ''}
      ${formatEmailMessage("Message", message)}
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: ["karlie@theboldfarm.com"],
      subject: `Inquiry About ${goatName}`,
      html: generateEmailTemplate({
        title: `New Inquiry About ${goatName}`,
        content: emailContent,
      }),
      text: generatePlainTextEmail({
        title: `New Inquiry About ${goatName}`,
        content: `Goat ID: ${goatId}\nGoat Name: ${goatName}\n\n---\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\nMessage:\n${message}`,
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
    console.error("Goat contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

