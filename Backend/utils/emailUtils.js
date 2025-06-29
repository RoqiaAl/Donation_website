"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config/.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.myEmail,
    pass: process.env.myEmailPassword,
  },
});

/**
 * Sends an email using the provided options.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.text - Plain text content of the email.
 * @param {string} [options.html] - Optional HTML content of the email.
 * @param {string} [options.from] - Sender email address (defaults to process.env.myEmail).
 * @returns {Promise<Object>} - The result from nodemailer.sendMail.
 */
async function sendEmail(options) {
  // Set default "from" if not provided.
  const mailOptions = {
    from: options.from || process.env.myEmail,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, // Optional HTML content.
  };

  // Send the email using the transporter.
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.response);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
