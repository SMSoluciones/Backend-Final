import Router from "./router.js";
import {
  getProducts,
  getProductById,
  addProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

import { PREMIUM_ACCESS, PRIVATE_ACCESS } from "../config/access.js";

import { passportStrategiesEnum } from "../config/enums.js";

export default class ProductsRouter extends Router {
  init() {
    // Add a new product
    this.post("/", PREMIUM_ACCESS, passportStrategiesEnum.JWT, addProducts);

    // Get a products
    this.get("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getProducts);

    // Get a product by id
    this.get(
      "/:id",
      PRIVATE_ACCESS,
      passportStrategiesEnum.JWT,
      getProductById
    );

    // Update a product
    this.put(
      "/:pid",
      PREMIUM_ACCESS,
      passportStrategiesEnum.JWT,
      updateProduct
    );

    // Delete a product by id
    this.delete(
      "/:pid",
      PREMIUM_ACCESS,
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
}
