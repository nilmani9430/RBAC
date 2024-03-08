exports.otpTemplate = (otp) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>OTP Verification - Gamerstag</title>
      <style>
        body {
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
        }
    
        .header {
          text-align: center;
          background-color: #FFD700;
          padding: 10px 0;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
    
        h1 {
          color: #333;
          font-size: 28px;
          margin-top: 10px;
        }
    
        p {
          color: #666;
          font-size: 18px;
          line-height: 1.6;
        }
    
        .otp {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
          text-align: center;
        }
    
        .btn {
          display: inline-block;
          background-color: #FFD700;
          color: #333;
          padding: 15px 30px;
          text-align: center;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 20px;
          margin-top: 20px;
        }
    
        .footer {
          background-color: #333;
          padding: 20px;
          color: #FFF;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OTP Verification - Gamerstag</h1>
        </div>
        <p>
    Behold, the ephemeral key, a cipher of verification for your sacred email.:</p>
        <p class="otp">${otp}</p>
        <p>If you didn't receive the OTP, please check your email or request a new one.</p>
        <p>Thank you for choosing Gamerstag! If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <div class="footer">
          &copy; 2023 Gamerstag. All rights reserved.
          <p style="font-size: 18px; margin-top: 10px;">Happy Gaming!<br>Team Gamerstag</p>
        </div>
      </div>
    </body>
    </html>
    `
}