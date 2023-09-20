import {
  // Cart imports
  addCart as addCartsRepository,
  getCart as getCartsRepository,
  getCartById as getCartByIdRepository,
  addProductToCart as addProductToCartRepository,
  updateProducts as updateProductsRepository,
  updateProductQuantity as updateProductQuantityRepository,
  deleteCart as deleteCartRepository,
  deleteCartProduct as deleteCartProductRepository,
  updateTicketPurchase as updateTicketPurchaseRepository,
} from "../repositories/carts.repository.js";

import purchaseEmailService from "./purchaseEmail.service.js";

import { PRODUCT_PREMIUM } from "../config/access.js";

import {
  // Product imports
  getProductById as getProductByIdRepository,
} from "../repositories/products.repository.js";

import { getLogger } from "../utils/logger.js";

const addCart = async (cart) => {
  const newCart = await addCartsRepository(cart);
  if (!newCart) {
    throw new Error("Error creating cart");
  }

  return newCart;
};

const getCart = async () => {
  return await getCartsRepository();
};

const getCartById = async (cid) => {
  const cart = await getCartByIdRepository(cid);
  if (!cart) {
    throw new Error("Cart not found");
  }
  return cart;
};

const addProductToCart = async (cid, pid) => {
  const cart = await getCartByIdRepository(cid, pid);
  const existProduct = await getProductByIdRepository(pid);
  if (!existProduct) {
    throw new Error("Product not found");
  }
  if (!cart) {
    throw new Error("Cart not found");
  }
  const newCart = await addProductToCartRepository(cid, pid);
  if (!newCart) {
    throw new Error("Error adding product to cart");
  }
  return newCart;
};

const updateProducts = async (cid, products) => {
  const existProduct = await getProductByIdRepository(products.pid);
  if (!existProduct) {
    throw new Error("Product not found");
  }

  const cart = await getCartByIdRepository(cid, products.pid);

  if (!cart) {
    throw new Error("Cart not found");
  }

  const newCart = await updateProductsRepository(cid, products);
  if (!newCart) {
    throw new Error("Error updating products");
  }
  return newCart;
};

const updateProductsQuantity = async (cid, pid, qty, user) => {
  const existProduct = await getProductByIdRepository(pid);
  if (!existProduct) {
    throw new Error("Product not found");
  }

  const productNull = PRODUCT_PREMIUM.includes(user.role);
  if (productNull) {
    if (existProduct.owner === user.email) {
      throw new Error("You can't buy your own product");
    }
  }

  const cart = await getCartByIdRepository(cid, pid, qty);
  if (!cart) {
    throw new Error("Cart not found");
  }
  const newCart = await updateProductQuantityRepository(cid, pid, qty, user);

  if (!newCart) {
    throw new Error("Error updating product quantity");
  }
  return newCart;
};

const deleteCart = async (id) => {
  const cart = await getCartByIdRepository(id);
  if (!cart) {
    throw new Error("Cart not found");
  }
  const result = await deleteCartRepository(id);
  if (!result) {
    throw new Error("Error deleting cart");
  }

  return result;
};

const deleteCartProduct = async (cid, pid) => {
  const existProduct = await deleteCartProductRepository(pid);

  if (!existProduct) {
    throw new Error("Error deleting cart product");
  }
  const cartProduct = await deleteCartProductRepository(cid, pid);

  if (!cartProduct) {
    throw new Error("Error deleting cart product");
  }

  return cartProduct;
};

const updateTicketPurchase = async (cid, user) => {
  const result = await updateTicketPurchaseRepository(cid, user);

  const userEmail = user.email;
  if (!userEmail) {
    throw new Error("User not found");
  }

  if (result.status !== "success") {
    throw new Error("Error updating ticket purchase");
  } else {
    const ticket = result.payload;
    const message = "Ticket ID: " + ticket.code;
    const total = ticket.amount;

    try {
      await purchaseEmailService(userEmail, message, total);
    } catch (error) {
      getLogger().error(error);
    }
  }

  return result;
};

export {
  addCart,
  getCart,
  getCartById,
  addProductToCart,
  updateProducts,
  updateProductsQuantity,
  deleteCart,
  deleteCartProduct,
  updateTicketPurchase,
};
