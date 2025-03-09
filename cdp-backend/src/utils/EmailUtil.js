// utils/emailUtils.js
const nodemailer = require("nodemailer");

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * Send an email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise} - Resolves if email is sent successfully, rejects otherwise
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(`Failed to send email to ${to}`);
  }
};

module.exports = { sendEmail };