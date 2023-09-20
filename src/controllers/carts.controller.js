import {
  addCart as addCartsService,
  getCart as getCartsService,
  getCartById as getCartByIdService,
  addProductToCart as addProductToCartService,
  updateProducts as updateProductsService,
  updateProductsQuantity as updateProductsQuantityService,
  deleteCart as deleteCartService,
  deleteCartProduct as deleteCartProductService,
  updateTicketPurchase as updateTicketPurchaseService,
} from "../services/carts.service.js";

import {
  updateUser as updateUserService,
  getByEmail as getByEmailUserService,
} from "../services/users.service.js";

import { getLogger } from "../utils/logger.js";

// Add a new cart
const addCart = async (req, res) => {
  const email = req.user.email;
  const user = await getByEmailUserService(email);

  try {
    const cart = {
      products: [],
    };
    const newCart = await addCartsService(cart);

    user.carts.push({ cart: newCart._id.toString() });

    await updateUserService(email, user);

    res.status(200).json({ status: "Cart Created", payload: newCart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error: error.message });
  }
};

// Get a carts
const getCart = async (req, res) => {
  try {
    const cart = await getCartsService(req.params.id);
    res.status(200).json({ status: "Cart Found", payload: cart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error: error.message });
  }
};

// Get a cart by id
const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;

    const cart = await getCartByIdService(cid);
    res.status(200).json({ status: "Cart Found", payload: cart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error });
  }
};

// Add a product to a cart
const addProductToCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const user = req.user;

  try {
    const cart = await addProductToCartService(cid, pid, user);

    res.status(200).json({ status: "Product added to cart", payload: cart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error });
  }
};

// Update a cart
const updateProducts = async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  const pid = products[0].id;

  try {
    let uptProd = await updateProductsService(cid, pid, products);
    res.status(200).json({ status: "Products updated", payload: uptProd });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error });
  }
};

// Update a product quantity
const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const user = req.user;

  try {
    let uptProdQua = await updateProductsQuantityService(
      cid,
      pid,
      quantity,
      user
    );
    res.send({ ...uptProdQua });
  } catch (error) {
    getLogger().error(error);
    res.status(400).send({ ...uptProdQua });
  }
};

// Delete a cart by id
const deleteCart = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await deleteCartService(cid);
    res.status(200).json({ status: "Cart Deleted", payload: cart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error: error.message });
  }
};

// Delete a product from a cart
const deleteProductFromCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cart = await deleteCartProductService(cid, pid);
    res
      .status(200)
      .json({ status: "Product deleted from cart", payload: cart });
  } catch (error) {
    getLogger().error(error);
    res.status(400).json({ info: "Error", error: error.message });
  }
};

// Update a ticket purchase
const updateTicketPurchase = async (req, res) => {
  const cid = req.params.cid;
  const user = req.user;
  try {
    const ticket = await updateTicketPurchaseService(cid, user);
    res.send({
      status: "success",
      message: "Ticket created successfully, check your email",
      payload: ticket,
    });
  } catch (error) {
    getLogger().error(error.message);
    res.status(400).send({
      status: "error",
      error: error.message,
    });
  }
};

export {
  addCart,
  getCart,
  getCartById,
  addProductToCart,
  deleteCart,
  updateProducts,
  updateProductQuantity,
  deleteProductFromCart,
  updateTicketPurchase,
};
