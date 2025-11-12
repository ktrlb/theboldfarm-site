import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    // Send email to farm owners
    const { data, error } = await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: ["karlie@theboldfarm.com", "rich@theboldfarm.com"],
      subject: `New Beef Interest Form: ${name}`,
      html: `
        <h2>New Beef Interest Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Share Type:</strong> ${shareTypeDisplay}</p>
        ${message ? `<p><strong>Additional Information:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
      `,
      text: `
New Beef Interest Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Share Type: ${shareTypeDisplay}
${message ? `\nAdditional Information:\n${message}` : ""}
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Send confirmation email to the requestor
    await resend.emails.send({
      from: "The Bold Farm <noreply@theboldfarm.com>",
      to: [email],
      subject: "Thank You for Your Interest in Our Farm-Raised Beef",
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We've received your interest form for our farm-raised beef. Here's a summary of your submission:</p>
        <ul>
          <li><strong>Share Type:</strong> ${shareTypeDisplay}</li>
        </ul>
        <p>We'll review your submission and contact you soon with more information about availability, pricing, and next steps.</p>
        <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:karlie@theboldfarm.com">karlie@theboldfarm.com</a>.</p>
        <p>Thank you for your interest in The Bold Farm!</p>
      `,
      text: `
Thank You, ${name}!

We've received your interest form for our farm-raised beef. Here's a summary of your submission:

Share Type: ${shareTypeDisplay}

We'll review your submission and contact you soon with more information about availability, pricing, and next steps.

If you have any questions in the meantime, feel free to reach out to us at karlie@theboldfarm.com.

Thank you for your interest in The Bold Farm!
      `,
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

