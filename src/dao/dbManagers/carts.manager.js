import cartModel from "../models/carts.model.js";
import ProductManager from "./products.manager.js";
import TicketManager from "./tickets.manager.js";
import { v4 as uuidv4 } from "uuid";

const productManager = new ProductManager();
const ticketManager = new TicketManager();

const randomCode = uuidv4();

export default class CartManager {
  addCart = async (cart) => {
    const result = await cartModel.create(cart);

    return result;
  };

  getCart = async () => {
    const carts = await cartModel.find().lean();
    return carts;
  };

  getCartById = async (cid) => {
    const cart = await cartModel.findOne({ _id: cid }).lean();
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  };

  addProductToCart = async (cid, pid) => {
    const cart = await this.getCartById(cid);

    let product = cart.products.find(
      (cart) => cart.product._id.toString() === pid
    );
    if (product) {
      product.quantity++;
    } else {
      product = {
        product: pid,
        quantity: 1,
      };
      cart.products.push(product);
    }
    const result = await cartModel.updateOne({ _id: cid }, cart);

    return result;
  };

  updateProducts = async (cid, products) => {
    const cart = await this.getCartById(cid);

    const insertToCart = [];
    products.forEach((p) => {
      let product = cart.products.find(
        (cart) => cart.product._id.toString() === p.id
      );
      if (product) {
        product.quantity = p.quantity;
      } else {
        product = {
          product: p.id,
          quantity: p.quantity,
        };
        insertToCart.push(product);
      }
    });
    insertToCart.forEach((data) => {
      cart.products.push(data);
    });
    const result = await cartModel.updateOne({ _id: cid }, cart);
    return result;
  };

  updateProductQuantity = async (cid, pid, qty) => {
    const cart = await this.getCartById(cid);
    let product = cart.products.find(
      (cart) => cart.product._id.toString() === pid
    );

    if (product) {
      product.quantity = qty;
    } else {
      product = {
        product: pid,
        quantity: qty,
      };
      cart.products.push(product);
    }
    const result = await cartModel.updateOne({ _id: cid }, cart);
    return result;
  };

  deleteCart = async (id) => {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };

  deleteProduct = async (cid, pid) => {
    const result = await cartModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
    return result;
  };

  updateTicketPurchase = async (cid, user) => {
    const cart = await this.getCartById(cid);
    const ticketProducts = [];

    let amount = 0;

    const cartOriginal = [...cart.products];
    for (const productCart of cartOriginal) {
      const product = await productManager.getProductById(
        productCart.product._id.toString()
      );
      if (product.stock >= productCart.quantity) {
        product.stock = product.stock - productCart.quantity;
        const result = await productManager.updateProduct(
          productCart.product._id.toString(),
          product
        );
        if (result) {
          const index = cart.products.indexOf(productCart);
          ticketProducts.push(product);
          cart.products.splice(index, 1);
          await this.deleteProduct(cid, productCart.product._id.toString());
          amount = amount + productCart.quantity * product.price;
        }
      }
    }
    if (ticketProducts.length === 0) {
      return {
        status: "error",
        error: "No products selected",
        carrito: cart.products,
      };
    } else {
      const today = new Date();
      const fechaHora = today.toLocaleString();

      const ticket = await ticketManager.updateTicket(
        randomCode,
        fechaHora,
        amount,
        user,
        ticketProducts
      );

      if (cart.products.length === 0) {
        return {
          status: "success",
          payload: ticket,
          ticketProducts: ticketProducts,
        };
      } else {
        return {
          status: "success",
          error: "No products stock",
          carrito: cart.products,
          payload: ticket,
          ticketProducts: ticketProducts,
        };
      }
    }
  };
}
