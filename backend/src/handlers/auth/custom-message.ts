import { CustomMessageTriggerEvent, CustomMessageTriggerHandler } from 'aws-lambda';

export const handler: CustomMessageTriggerHandler = async (event: CustomMessageTriggerEvent) => {
  if (event.triggerSource === 'CustomMessage_SignUp' || event.triggerSource === 'CustomMessage_ResendCode') {
    const { codeParameter } = event.request;
    event.response.emailSubject = 'Welcome to Kochess - Verify your account';
    event.response.emailMessage = getHtmlTemplate('Verification Code', `Welcome to Kochess! We're excited to have you on board. Please use the following code to verify your account:`, codeParameter);
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const { codeParameter } = event.request;
    event.response.emailSubject = 'Kochess - Reset your password';
    event.response.emailMessage = getHtmlTemplate('Reset Password', `We received a request to reset your password. Use the code below to proceed:`, codeParameter);
  }

  return event;
};

function getHtmlTemplate(title: string, description: string, code: string) {
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background-color: #fdc700; padding: 40px; text-align: center; }
        .content { padding: 40px; color: #1a1a1a; line-height: 1.6; }
        .code-container { background-color: #f8f9fa; border: 1px dashed #fdc700; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #DF1463; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; background-color: #fcfcfc; }
        h1 { margin: 0; color: #000; font-size: 24px; }
        .logo { font-size: 32px; font-weight: 800; color: #000; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">KOCHESS</div>
            <h1>${title}</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>${description}</p>
            <div class="code-container">
                <div class="code">${code}</div>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>The Kochess Team</p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Kochess. All rights reserved.
        </div>
    </div>
</body>
</html>
  `;
}
