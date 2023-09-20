import nodemailer from "nodemailer";
import config from "../config/config.js";

const purchaseEmailService = async (userEmail, message, total) => {
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
    to: userEmail,
    subject: "Angelo Pastas_Recibo de compra",
    html: `
    <h1>Angelo Pastas</h1>
    <h2>¡Felicitaciones su compra ha sido realizada con exito!</h2>
    
    <p>${message}</p>
    <p>El total de su compra es: $${total}</p>
    <p>Saludos</p>
    `,
  });

  return { status: "success", message: "Email sent" };
};

export default purchaseEmailService;
