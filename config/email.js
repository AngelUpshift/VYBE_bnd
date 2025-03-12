const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(emailOptions);
};

module.exports = sendEmail;
