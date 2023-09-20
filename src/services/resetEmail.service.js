import nodemailer from "nodemailer";
import config from "../config/config.js";

const resetEmailService = async (email, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: config.mailUser,
      pass: config.mailUserPass,
    },
  });

  await transporter.sendMail({
    from: config.mailUser,
    to: email,
    subject: "Angelo Pastas_Recuperar contraseña",
    html: `
    <h1>Angelo Pastas</h1>
    <h2>¡Hola!</h2>

    <p>${message}</p>
    <p>Saludos</p>
    `,
  });

  return { status: "success", message: "Email sent" };
};

export default resetEmailService;
