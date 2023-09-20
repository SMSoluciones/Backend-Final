import { fileURLToPath } from "url";
import config from "./config/config.js";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const generateToken = (user) => {
  const token = jwt.sign({ user }, config.jwtPrivateKey, { expiresIn: "24h" });
  return token;
};

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtPrivateKey, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    });
  });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let filePath = "";

    if (req.files.products) {
      filePath = "products";
    } else if (req.files.profile) {
      filePath = "profiles";
    } else {
      filePath = "documents";
    }
    cb(null, `${__dirname}/public/img/${filePath}`);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
  onError: (err, next) => {
    next();
  },
});

export {
  __dirname,
  createHash,
  generateToken,
  isValidPassword,
  verifyToken,
  uploader,
};
