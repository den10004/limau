import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { marked } from "marked";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { emails, title, content } = data;

  if (!emails || emails.length === 0) {
    return new Response(JSON.stringify({ message: "Подписчиков не найдено" }), {
      status: 200,
    });
  }

  // Конвертация Markdown -> HTML
  const htmlContent = marked.parse(content);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    for (const email of emails) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: title,
        html: `
          <!DOCTYPE html>
          <html lang="ru">
            <head>
              <meta charset="UTF-8" />
              <title>${title}</title>
            </head>
            <body style="margin:0; padding:0; font-family: "Roboto", "Arial", sans-serif; background-color: #f7f7f7;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: var(--color-grayAO); padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: var(----color-white); padding: 20px; border-radius: 8px;">
                      <tr>
                        <td>
                          <h1 style="font-size: 20px; color: var(--color-black);">${title}</h1>
                          <div style="font-size: 16px; line-height: 1.5; color: var(--color-black)">
                            ${htmlContent}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 20px; font-size: 12px; color: (var--color-gray56); text-align: center;">
                          © ${new Date().getFullYear()} Limaudio. Все права защищены.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return new Response(
      JSON.stringify({ message: "Emails sent", count: emails.length }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Email failed", error }), {
      status: 500,
    });
  }
}
