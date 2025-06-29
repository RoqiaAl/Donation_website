const { sendEmail } = require("../utils/emailUtils");

const handleContactForm = async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  const htmlMessage = `
    <h3>New Contact Message</h3>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `;

  try {
    await sendEmail({
      to: process.env.myEmail, // YOU receive it
      subject: `Contact Form Submission from ${fullName}`,
      html: htmlMessage,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: err.message,
    });
  }
};

module.exports = { handleContactForm };
