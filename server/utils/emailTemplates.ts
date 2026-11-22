/**
 * Email template functions for contact form
 * Generates beautified HTML emails for both confirmation (to sender) and admin notification
 */

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const container = `
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #e5e5e5;
  padding: 0;
`;

const header = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px;
  text-align: center;
  border-bottom: 4px solid #667eea;
`;

const content = `
  padding: 40px 30px;
  line-height: 1.6;
  color: #e5e5e5;
`;

const footer = `
  background: rgba(255, 255, 255, 0.05);
  padding: 20px 30px;
  text-align: center;
  font-size: 12px;
  color: #999;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const button = `
  display: inline-block;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin: 20px 0;
  transition: transform 0.2s ease;
`;

const infoBox = `
  background: rgba(102, 126, 234, 0.1);
  border-left: 4px solid #667eea;
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 4px;
`;

const fieldLabel = `
  font-weight: 600;
  color: #667eea;
  margin-top: 15px;
  margin-bottom: 5px;
`;

/**
 * Confirmation email sent to the form submitter
 */
export function confirmationEmail(name: string): string {
  const firstName = name.split(" ")[0] || name;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      ${baseStyles}
    }
    .container {
      ${container}
    }
    .header {
      ${header}
    }
    .content {
      ${content}
    }
    .footer {
      ${footer}
    }
    h1 { 
      margin: 0; 
      font-size: 32px; 
      color: white; 
      font-weight: 700;
    }
    h2 { 
      color: #667eea; 
      font-size: 20px; 
      margin-top: 0; 
    }
    p { 
      margin: 10px 0; 
      font-size: 15px;
    }
  </style>
</head>
<body>
  <table class="container" cellpadding="0" cellspacing="0" style="width: 100%; ${container}">
    <tr>
      <td>
        <div class="header" style="${header}">
          <h1>✓ Message Received</h1>
        </div>
        
        <div class="content" style="${content}">
          <p style="font-size: 18px; margin-bottom: 20px;">
            Hi <strong>${firstName}</strong>,
          </p>
          
          <p style="margin-bottom: 20px;">
            Thank you for reaching out! I've received your message and appreciate you taking the time to contact me.
          </p>
          
          <div style="${infoBox}">
            <p style="margin: 0; color: #667eea; font-weight: 600;">
              📧 Your message is important to me
            </p>
            <p style="margin: 5px 0 0 0; font-size: 13px;">
              I will review your message carefully and get back to you as soon as possible.
            </p>
          </div>
          
          <p style="margin-top: 25px; color: #aaa;">
            <strong style="color: #e5e5e5;">What's next?</strong><br>
            You can expect a response within 24-48 hours. If you have any urgent matters, please don't hesitate to reach out through other channels.
          </p>
          
          <p style="margin-top: 30px; font-size: 13px; color: #888;">
            Best regards,<br>
            <strong style="color: #e5e5e5;">Chethiya Nuwan</strong>
          </p>
        </div>
        
        <div class="footer" style="${footer}">
          <p style="margin: 0;">© 2025 Chethiya Nuwan. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 11px;">This is an automated confirmation message.</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Admin notification email sent to your email address
 * Contains detailed information about the contact submission
 */
export function adminNotificationEmail(
  name: string,
  email: string,
  message: string
): string {
  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      ${baseStyles}
    }
    .container {
      ${container}
    }
    .header {
      ${header}
    }
    .content {
      ${content}
    }
    .footer {
      ${footer}
    }
    h1 { 
      margin: 0; 
      font-size: 32px; 
      color: white; 
      font-weight: 700;
    }
    h2 { 
      color: #667eea; 
      font-size: 18px; 
      margin: 25px 0 15px 0;
      border-bottom: 2px solid rgba(102, 126, 234, 0.3);
      padding-bottom: 8px;
    }
    p { 
      margin: 10px 0; 
      font-size: 15px;
    }
    .meta-info {
      background: rgba(102, 126, 234, 0.08);
      padding: 12px 15px;
      border-radius: 4px;
      margin: 5px 0;
      font-size: 13px;
      border-left: 3px solid #667eea;
    }
    .message-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(102, 126, 234, 0.2);
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
      line-height: 1.8;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .field-row {
      margin: 12px 0;
    }
    .field-label {
      ${fieldLabel}
      display: inline-block;
      min-width: 100px;
    }
    .field-value {
      color: #e5e5e5;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <table class="container" cellpadding="0" cellspacing="0" style="width: 100%; ${container}">
    <tr>
      <td>
        <div class="header" style="${header}">
          <h1>🔔 New Contact Form Submission</h1>
        </div>
        
        <div class="content" style="${content}">
          <p style="font-size: 16px; margin-bottom: 5px; color: #aaa;">
            You have received a new message from your portfolio contact form.
          </p>
          
          <h2>Sender Information</h2>
          
          <div class="field-row" style="margin: 12px 0;">
            <span class="field-label" style="${fieldLabel}">Name:</span>
            <span class="field-value" style="color: #e5e5e5;">${name}</span>
          </div>
          
          <div class="field-row" style="margin: 12px 0;">
            <span class="field-label" style="${fieldLabel}">Email:</span>
            <span class="field-value" style="color: #667eea;">
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none; border-bottom: 1px solid #667eea;">
                ${email}
              </a>
            </span>
          </div>
          
          <div class="meta-info" style="${infoBox}">
            <strong>📅 Received at:</strong><br>
            ${timestamp}
          </div>
          
          <h2>Message</h2>
          <div class="message-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(102, 126, 234, 0.2); padding: 15px; border-radius: 6px; margin: 15px 0; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">
            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
          
          <h2>Actions</h2>
          <p style="font-size: 14px; color: #aaa;">
            <strong style="color: #e5e5e5;">Reply directly:</strong><br>
            This email was sent from <strong>${email}</strong>. You can reply directly to this email to respond to the sender.
          </p>
          
          <div style="${infoBox}">
            <p style="margin: 0; font-size: 13px;">
              ⚡ Quick action: Click the reply button above to send a response.
            </p>
          </div>
        </div>
        
        <div class="footer" style="${footer}">
          <p style="margin: 0;">Contact Form Notification — Do not reply to this email address</p>
          <p style="margin: 5px 0 0 0; font-size: 11px;">This is an automated notification from your portfolio website.</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
