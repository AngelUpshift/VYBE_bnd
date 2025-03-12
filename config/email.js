const nodemailer = require("nodemailer");
require("dotenv").config();

// const sendEmail = async (options) => {
//   const transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const emailOptions = {
//     from: process.env.EMAIL_USER,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transport.sendMail(emailOptions);
// };

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9968a2fa63d5c4",
      pass: "5075f2c65f0a8e",
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
