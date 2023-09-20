import { Router } from "express";

import {
  addProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/mocking.controller.js";

import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", addProducts);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
