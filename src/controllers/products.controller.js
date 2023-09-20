import {
  addProduct as addProductsService,
  getProducts as getProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/products.service.js";

import {
  ROLE_PERMISSIONS,
  PRODUCT_PREMIUM,
  ADMIN_ACCESS,
} from "../config/access.js";

import { getLogger } from "../utils/logger.js";

// Add Product
const addProducts = async (req, res) => {
  const { body: productNew, user } = req;
  if (user.role === ROLE_PERMISSIONS.PREMIUM) productNew.owner = user.email;
  try {
    const result = await addProductsService(productNew);

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(406).json({ info: "Product already present in list", error });
  }
};

// Product List with Pagination, Sorting, and Filtering
const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const query = req.query.query || undefined;
  const sort = req.query.sort || undefined;

  try {
    const result = await getProductsService(limit, page, query, sort);
    const products = [...result];

    res.send({
      status: "success",
      payload: products,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    });
  } catch (error) {
    getLogger().error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProductByIdService(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ status: "Success", payload: product });
    }
  } catch (error) {
    getLogger().error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const pid = req.params.pid;
  const { body: productUpdate, user } = req;
  try {
    const product = await getProductByIdService(pid);
    if (!product) throw new Error("Product not found");

    const noAuth = PRODUCT_PREMIUM.includes(user.role);

    if (noAuth) {
      if (product.owner !== user.email) {
        throw new Error("You are not authorized to update this product");
      }
    }

    const productAfterUpdate = await updateProductService(pid, productUpdate);

    res.send({ status: "success", payload: productAfterUpdate });
  } catch (error) {
    getLogger().error(error);
    res.status(500).send(error.message);
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const pid = req.params.pid;
  const user = req.user;

  try {
    const product = await getProductByIdService(pid);
    if (!product) throw new Error("Product not found");

    const auth = PRODUCT_PREMIUM.includes(user.role);

    if (auth) {
      if (user.role === ADMIN_ACCESS) {
        return await deleteProductService(pid);
      } else if (product.owner !== user.email) {
        throw new Error("You are not authorized to delete this product");
      }
    }

    const deletedProduct = await deleteProductService(pid);

    res.send({
      status: "success",
      message: "Product deleted",
      payload: deletedProduct,
    });
  } catch (error) {
    getLogger().error(error.message);
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export {
  getProducts,
  getProductById,
  addProducts,
  updateProduct,
  deleteProduct,
};
