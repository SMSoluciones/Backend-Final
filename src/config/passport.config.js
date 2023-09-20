import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../dao/models/users.model.js";
import GitHubStrategy from "passport-github2";
import config from "./config.js";

import { createHash, isValidPassword } from "../utils.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtPrivateKey,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Github Login
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.180329900c2477ca",
        clientSecret: "3f7cd7398da5267d69d9447dfae2ca9d231f565b",
        callbackURL: "http://localhost:8080/api/users/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await userModel.findOne({ email });
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email,
              password: "",
              role: "USER",
              carts: [],
            };

            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  // User Register
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: username });

          if (user) {
            return done(null, false, { message: "El usuario ya existe." });
          }

          const userToSave = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          const result = await userModel.create(userToSave);
          return done(null, result, { message: "Usuario creado con exito." });
        } catch (error) {
          return done(`Error al crear el usuario: ${error.message}`);
        }
      }
    )
  );

  // User Login
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false, {
              message: "Usuario o contraseña incorrecta.",
            });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta." });
          }

          return done(null, user, { message: "Login exitoso." });
        } catch (error) {
          return done(error, { message: error.message });
        }
      }
    )
  );

  // Serialize User
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
