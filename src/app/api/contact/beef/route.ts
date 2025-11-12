import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailTemplate, formatEmailField, formatEmailMessage, generatePlainTextEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, shareType, message } = body;

    // Validate required fields
    if (!name || !email || !shareType) {
      return NextResponse.json(
        { error: "Name, email, and share type are required" },
        { status: 400 }
      );
    }

    // Format share type for display
    const shareTypeMap: Record<string, string> = {
      quarter: "Quarter Cow",
      half: "Half Cow",
      "not-sure": "Not Sure Yet",
    };
    const shareTypeDisplay = shareTypeMap[shareType] || shareType;

    // Build email content for farm owners
    const ownerEmailContent = `
      ${formatEmailField("Name", name)}
      ${formatEmailField("Email", email)}
      ${phone ? formatEmailField("Phone", phone) : ""}
      ${formatEmailField("Share Type", shareTypeDisplay)}
      ${message ? formatEmailMessage("Additional Information", message) : ""}
    `;

    // Send email to farm owners
    const { data, error } = await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: ["karlie@theboldfarm.com", "rich@theboldfarm.com"],
      subject: `New Beef Interest Form: ${name}`,
      html: generateEmailTemplate({
        title: "New Beef Interest Form Submission",
        content: ownerEmailContent,
      }),
      text: generatePlainTextEmail({
        title: "New Beef Interest Form Submission",
        content: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\nShare Type: ${shareTypeDisplay}${message ? `\n\nAdditional Information:\n${message}` : ""}`,
      }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Build confirmation email content
    const confirmationContent = `
      <p style="margin: 0 0 20px 0;">We've received your interest form for our farm-raised beef. Here's a summary of your submission:</p>
      <div style="background-color: #F5F1E8; padding: 15px; border-left: 3px solid #7CB342; border-radius: 4px; margin: 0 0 20px 0;">
        ${formatEmailField("Share Type", shareTypeDisplay)}
      </div>
      <p style="margin: 0 0 20px 0;">We'll review your submission and contact you soon with more information about availability, pricing, and next steps.</p>
      <p style="margin: 0 0 20px 0;">If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:karlie@theboldfarm.com" style="color: #7CB342; text-decoration: none;">karlie@theboldfarm.com</a>.</p>
      <p style="margin: 0;">Thank you for your interest in The Bold Farm!</p>
    `;

    // Send confirmation email to the requestor
    await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: [email],
      subject: "Thank You for Your Interest in Our Farm-Raised Beef",
      html: generateEmailTemplate({
        title: `Thank You, ${name}!`,
        content: confirmationContent,
      }),
      text: generatePlainTextEmail({
        title: `Thank You, ${name}!`,
        content: `We've received your interest form for our farm-raised beef. Here's a summary of your submission:\n\nShare Type: ${shareTypeDisplay}\n\nWe'll review your submission and contact you soon with more information about availability, pricing, and next steps.\n\nIf you have any questions in the meantime, feel free to reach out to us at karlie@theboldfarm.com.\n\nThank you for your interest in The Bold Farm!`,
      }),
    });

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Error processing beef interest form:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}

