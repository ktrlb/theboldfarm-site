import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: ["karlie@theboldfarm.com"],
      subject: `Inquiry About ${goatName}`,
      html: `
        <h2>New Inquiry About ${goatName}</h2>
        <p><strong>Goat ID:</strong> ${goatId}</p>
        <p><strong>Goat Name:</strong> ${goatName}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
New Inquiry About ${goatName}

Goat ID: ${goatId}
Goat Name: ${goatName}

---
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}
      `,
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

