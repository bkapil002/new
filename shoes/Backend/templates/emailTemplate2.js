const emailTemplate2 = (otp) => {
  return `
     <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f9f9f9;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #FF5733;
            margin: 20px 0;
            text-align: center;
            padding: 10px;
            background-color: #fff;
            border-radius: 5px;
          }
          .warning {
            color: #dc3545;
            font-size: 14px;
            margin: 10px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Welcome to Store</div>
          <p>Hello,</p>
          <p>Thank you for choosing Store. To complete your account creation, please use the OTP code below:</p>
          <div class="code">${otp}</div>
          <p class="warning">⚠️ This code will expire in 2 minutes and allows only 3 attempts.</p>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

module.exports = emailTemplate2;
