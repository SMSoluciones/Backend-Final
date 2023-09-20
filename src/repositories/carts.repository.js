import { CARTSDAO } from "../dao/index.js"; // ✅

const addCart = async (cart) => {
  const newCarts = await CARTSDAO.addCart(cart);
  return newCarts;
};

const getCart = async () => {
  const carts = await CARTSDAO.getCart();
  return carts;
};

const getCartById = async (cid) => {
  const cart = await CARTSDAO.getCartById(cid);
  return cart;
};

const addProductToCart = async (cid, pid) => {
  const result = await CARTSDAO.addProductToCart(cid, pid);
  return result;
};

const updateProducts = async (cid, products) => {
  const result = await CARTSDAO.updateProducts(cid, products);
  return result;
};

const updateProductQuantity = async (cid, pid, qty) => {
  const result = await CARTSDAO.updateProductQuantity(cid, pid, qty);
  return result;
};
const deleteCart = async (id) => {
  const result = await CARTSDAO.deleteCart(id);
  return result;
};

const deleteCartProduct = async (cid, pid) => {
  const result = await CARTSDAO.deleteProduct(cid, pid);
  return result;
};

const updateTicketPurchase = async (cid, user) => {
  const result = await CARTSDAO.updateTicketPurchase(cid, user);
  return result;
};

export {
  addCart,
  getCart,
  getCartById,
  addProductToCart,
  updateProducts,
  updateProductQuantity,
  deleteCart,
  deleteCartProduct,
  updateTicketPurchase,
};
