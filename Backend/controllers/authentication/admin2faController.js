"use strict";

const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { Auth } = require("../../models");

/**
 * Renders the secure 2FA setup page.
 * Expects query parameters: email and token.
 * Validates the token, then dynamically generates a QR code from the stored TOTP secret.
 */
async function render2faSetup(req, res) {
  const { email, token } = req.query;
  if (!email || !token) {
    return res.status(400).send("Missing email or token.");
  }

  // Retrieve the admin's Auth record
  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    return res.status(404).send("User not found.");
  }

  // Validate the one-time token and expiration
  if (authRecord.verification_token !== token) {
    return res.status(400).send("Invalid token.");
  }
  if (new Date() > authRecord.token_expires) {
    return res.status(400).send("Token has expired.");
  }

  // Build the otpauth URL for TOTP using the stored secret
  const otpauthURL = `otpauth://totp/Admin%20Portal%20(${encodeURIComponent(
    email
  )})?secret=${authRecord.totp_secret}&issuer=YourAppName`;

  try {
    // Generate a QR code as a data URL
    const qrDataUrl = await qrcode.toDataURL(otpauthURL);
    // Render a modern HTML page with the QR code and Base32 secret
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Secure Account Setup | 2FA Configuration</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            :root {
              --primary: #1598D2;
              --primary-light: #2DC5F2;
              --secondary: #6BDCF6;
              --accent: #F4B5AE;
              --accent-light: #F7CDC7;
              --white: #ffffff;
              --gray-100: #f8f9fa;
              --gray-200: #e9ecef;
              --gray-500: #adb5bd;
              --gray-800: #343a40;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              background: linear-gradient(135deg, var(--gray-100), var(--secondary));
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: var(--gray-800);
              line-height: 1.6;
            }
            
            .container {
              background: var(--white);
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
              width: 100%;
              max-width: 420px;
              padding: 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 8px;
              background: linear-gradient(90deg, var(--primary), var(--secondary));
            }
            
            h1 {
              color: var(--primary);
              font-weight: 600;
              margin-bottom: 24px;
              font-size: 24px;
            }
            
            .qr-container {
              background: var(--white);
              padding: 20px;
              border-radius: 12px;
              border: 1px solid var(--gray-200);
              margin: 20px auto;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            
            img {
              width: 200px;
              height: 200px;
              border: 1px solid var(--gray-200);
              border-radius: 8px;
            }
            
            .instructions {
              margin: 24px 0;
              text-align: left;
              font-size: 15px;
              color: var(--gray-800);
            }
            
            .secret-container {
              background: var(--gray-100);
              padding: 16px;
              border-radius: 8px;
              margin: 20px 0;
              word-break: break-all;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: var(--primary);
              border: 1px dashed var(--primary-light);
              position: relative;
            }
            
            .secret-label {
              display: block;
              font-size: 13px;
              color: var(--gray-500);
              margin-bottom: 8px;
              font-family: 'Inter', sans-serif;
            }
            
            .steps {
              text-align: left;
              margin: 24px 0;
            }
            
            .step {
              display: flex;
              margin-bottom: 12px;
              align-items: flex-start;
            }
            
            .step-number {
              background: var(--accent);
              color: var(--white);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              font-weight: 600;
              margin-right: 12px;
              flex-shrink: 0;
            }
            
            .footer {
              margin-top: 24px;
              font-size: 13px;
              color: var(--gray-500);
            }
            
            @media (max-width: 480px) {
              .container {
                padding: 30px 20px;
              }
              
              h1 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Two-Factor Authentication Setup</h1>
            
            <div class="instructions">
              <p>Secure your account by setting up 2FA. Scan the QR code below with your authenticator app.</p>
            </div>
            
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code for 2FA Setup" />
            </div>
            
            <div class="secret-container">
              <span class="secret-label">MANUAL ENTRY SECRET</span>
              ${authRecord.totp_secret}
            </div>
            
            <div class="steps">
              <div class="step">
                <div class="step-number">1</div>
                <div>Install an authenticator app like Google Authenticator or Authy</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div>Scan the QR code or manually enter the secret key</div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div>Enter the 6-digit code from your app to complete setup</div>
              </div>
            </div>
            
            <div class="footer">
              <p>For security reasons, this setup page will expire after completion.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    res.send(htmlContent);
  } catch (err) {
    console.error("Error generating QR code:", err);
    res.status(500).send("Error generating QR code.");
  }
}

module.exports = { render2faSetup };
