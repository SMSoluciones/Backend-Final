import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  mongoUrl: process.env.MONGO_URL,
  jwtPrivateKey: process.env.PRIVATE_KEY,
  secretSessionKey: process.env.SECRET_SESSION_KEY,
  mailUserPass: process.env.MAIL_USER_PASS,
  mailUser: process.env.MAIL_USER,
  enviroment: process.env.NODE_ENV,
  inactivity_time: process.env.INACTIVITY_TIME,
};
