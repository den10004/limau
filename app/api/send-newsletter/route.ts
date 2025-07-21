// app/api/email/route.ts

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailTemplate } from "@/lib/emailTemplate";

export async function POST(req: NextRequest) {
  console.log("=== ROUTE HANDLER STARTED ===");

  try {
    const { marked } = await import("marked");

    const { title, content, email } = await req.json();

    if (!title || !content || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const htmlContent = await marked.parse(content);

    const html = emailTemplate(title, htmlContent);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: title,
      html,
    });

    console.log("=== EMAIL SENT SUCCESSFULLY ===");

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("EMAIL SEND ERROR", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
