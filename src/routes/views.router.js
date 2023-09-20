import {
  registerView,
  loginView,
  resetView,
  getProfile,
  homeView,
  productView,
  getCategory,
  cartView,
  realtimeproductsView,
  chatRender,
  resetPasswordView,
  usersView,
} from "../controllers/views.controller.js";

import {
  PUBLIC_ACCESS,
  PRIVATE_ACCESS,
  PREMIUM_ACCESS,
  ADMIN_ACCESS,
} from "../config/access.js";

import { __dirname } from "../utils.js";
import Router from "./router.js";

import { passportStrategiesEnum } from "../config/enums.js";

export default class ViewsRouter extends Router {
  init() {
    this.get(
      "/register",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      registerView
    );

    this.get("/", PUBLIC_ACCESS, passportStrategiesEnum.NOTHING, loginView);

    this.get(
      "/reset",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      resetView
    );

    this.get(
      "/reset-password",
      PUBLIC_ACCESS,
      passportStrategiesEnum.NOTHING,
      resetPasswordView
    );

    this.get(
      "/profile",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      getProfile
    );

    // Product List
    this.get("/home", PRIVATE_ACCESS, passportStrategiesEnum.JWT, homeView);
    this.get(
      "/product/:pid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      productView
    );

    // Category
    this.get("/category/:category", getCategory);

    this.get(
      "/carts/:cid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      cartView
    );

    this.get(
      "/realTimeProducts",
      PREMIUM_ACCESS,
      passportStrategiesEnum.JWT,
      realtimeproductsView
    );

    this.get("/admin", ADMIN_ACCESS, passportStrategiesEnum.JWT, usersView);

    // Chat
    this.get("/chat", PRIVATE_ACCESS, passportStrategiesEnum.JWT, chatRender);
  }
}
