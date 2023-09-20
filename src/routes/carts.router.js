import Router from "./router.js";
import {
  addCart,
  getCart,
  getCartById,
  addProductToCart,
  deleteCart,
  updateProducts,
  updateProductQuantity,
  deleteProductFromCart,
  updateTicketPurchase,
} from "../controllers/carts.controller.js";

import {
  PRIVATE_ACCESS,
  ADMIN_ACCESS,
  PREMIUM_ACCESS,
} from "../config/access.js";

import { passportStrategiesEnum } from "../config/enums.js";

export default class CartsRouter extends Router {
  init() {
    // Add a new cart
    this.post("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, addCart);

    // Get a carts
    this.get("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getCart);

    // Get a cart by id
    this.get("/:cid", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getCartById);

    // Add a product to a cart
    this.post(
      "/:cid/products/:pid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      addProductToCart
    );

    // Update a cart
    this.put(
      "/:cid",
      PREMIUM_ACCESS,
      passportStrategiesEnum.JWT,
      updateProducts
    );

    // Update a product quantity
    this.put(
      "/:cid/products/:pid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      updateProductQuantity
    );

    // Delete a cart by id
    this.delete(
      "/:cid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      deleteCart
    );

    // Delete a product from a cart
    this.delete(
      "/:cid/products/:pid",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      deleteProductFromCart
    );

    // Purchase a cart
    this.post(
      "/:cid/purchase",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      updateTicketPurchase
    );
  }
}
