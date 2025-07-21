export function emailTemplate(title: string, htmlContent: string) {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f7f7f7;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                <tr>
                  <td>
                    <h1 style="font-size: 20px; color: #333333;">${title}</h1>
                    <div style="font-size: 16px; line-height: 1.5; color: #555555;">
                      ${htmlContent}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; font-size: 12px; color: #999999; text-align: center;">
                    © ${new Date().getFullYear()} Limaudio. Все права защищены.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
