import Router from "./router.js";
import passport from "passport";
import {
  loginUser,
  registerUser,
  logoutUser,
  githubUser,
  githubCallbackUser,
  resetUser,
  resetEmailUser,
  getUsers,
  updateUserRole,
  updateUserDocument,
  deleteUsers,
  deleteUser,
} from "../controllers/users.controller.js";

import {
  PUBLIC_ACCESS,
  PRIVATE_ACCESS,
  PREMIUM_ACCESS,
  ADMIN_ACCESS,
} from "../config/access.js";

import Users from "../dao/dbManagers/users.manager.js";
import { passportStrategiesEnum } from "../config/enums.js";

import { uploader } from "../utils.js";

const usersManager = new Users();

export default class UsersRouter extends Router {
  init() {
    // Login
    this.post(
      "/login",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      loginUser
    );

    // Register
    this.post(
      "/register",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      registerUser
    );

    this.post(
      "/reset",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      resetEmailUser
    );

    this.post(
      "/reset-user",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      resetUser
    );

    // Github Login
    this.get(
      "/github",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      passport.authenticate("github", { scope: ["user:email"] }),
      githubUser
    );

    this.get(
      "/github-callback",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      passport.authenticate("github", { failureRedirect: "/" }),
      githubCallbackUser
    );

    // Logout
    this.get(
      "/logout",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      logoutUser
    );

    this.get("/", ADMIN_ACCESS, passportStrategiesEnum.JWT, getUsers);

    this.put(
      "/premium/:uid",
      PUBLIC_ACCESS,
      passportStrategiesEnum.JWT,
      updateUserRole
    );

    this.post(
      "/:uid/documents",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      uploader.fields([
        { name: "products" },
        { name: "profile", maxCount: 1 },
        { name: "identification", maxCount: 1 },
        { name: "address", maxCount: 1 },
        { name: "account_state", maxCount: 1 },
      ]),
      updateUserDocument
    );

    this.delete("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, deleteUsers);

    this.delete(
      "/:uid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      deleteUser
    );
  }
}

// router.get("/fail-register", async (req, res) => {
//   res.send({ status: "error", message: "Error al crear el usuario." });
// });

// router.get("/fail-login ", async (req, res) => {
//   res.send({ status: "error", message: "Error al loguear" });
// });
