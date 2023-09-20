import nodemailer from "nodemailer";
import config from "../config/config.js";

const deleteEmail = async (
  email,
  messageEmail1,
  messageEmail2,
  subjectEmail
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: config.mailUser,
      pass: config.mailUserPass,
    },
  });

  await transporter.sendMail({
    from: "Ecommerce",
    to: email,
    subject: subjectEmail,
    html: `
    <h1>Angelo Pastas</h1>
    <h2>${messageEmail1}</h2>
    <p>${messageEmail2}</p>
    <p>Saludos</p>
    `,
  });
};

export default deleteEmail;
