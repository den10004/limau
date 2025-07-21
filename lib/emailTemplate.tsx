export function emailTemplate(title: string, htmlContent: string) {
  return `

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="background-color: #4a90e2; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
            ${htmlContent}
          </td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #666666; font-size: 14px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Limaudio, все права защищены</p>
           
            <p style="margin: 5px 0;">
              <a href="#" style="color: #4a90e2; text-decoration: none;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
