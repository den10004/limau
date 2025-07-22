import { NextResponse } from "next/server";
import { emailTemplate } from "@/lib/emailTemplate";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const { subject, content, subscribers } = await request.json();

    if (!subject || !content || !subscribers || !Array.isArray(subscribers)) {
      return NextResponse.json(
        { error: "Missing required fields or invalid subscribers" },
        { status: 400 }
      );
    }

    // Generate unsubscribe link for each subscriber
    const sendEmails = subscribers.map(
      async (subscriber: { email: string; name?: string }) => {
        const unsubscribeUrl = `${
          process.env.API_URL
        }/api/subscribers/delete-by-email/${encodeURIComponent(
          subscriber.email
        )}`;

        // Generate email content with unsubscribe link
        const htmlContent = `
        ${content}
        <p style="margin-top: 20px;">
          <a href="${unsubscribeUrl}" style="color: var(--color-blue); text-decoration: underline;">
            Отписаться от рассылки
          </a>
        </p>
      `;

        // Use the provided email template
        const emailBody = emailTemplate(subject, htmlContent, subscriber.email);

        // Send email
        await transporter.sendMail({
          from: process.env.EMAIL_USER || "no-reply@limaudio.ru",
          to: subscriber.email,
          subject: subject,
          html: emailBody,
        });
      }
    );

    // Wait for all emails to be sent
    await Promise.all(sendEmails);

    return NextResponse.json(
      { message: "Newsletter sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}

// Optional: Handle DELETE request to process unsubscribe directly
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.pathname.split("/").pop();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Call Strapi's delete-by-email endpoint using fetch
    const response = await fetch(
      `${process.env.API_URL}/api/subscribers/delete-by-email/${email}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    return NextResponse.json(
      { message: `Successfully unsubscribed ${email}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing unsubscribe:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
