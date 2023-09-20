import { getCartById as getCartByIdService } from "../services/carts.service.js";
import {
  getProducts as getProductsService,
  getProductById as getProductByIdService,
} from "../services/products.service.js";
import productsModel from "../dao/models/products.model.js";

import { CARTS_ACCESS } from "../config/access.js";
import {
  getByEmail as getByEmailUserService,
  getUsers as getUsersService,
} from "../services/users.service.js";

import { verifyToken } from "../utils.js";

const registerView = (req, res) => {
  res.render("register");
};

const loginView = (req, res) => {
  res.render("login");
};

const resetView = (req, res) => {
  res.render("reset");
};

const resetPasswordView = async (req, res) => {
  const token = req.query.token;

  try {
    const decoder = await verifyToken(token);
    decoder;
    const email = decoder.user.email;

    return res.render("resetPassword", { email, token });
  } catch (err) {
    return res.status(400).send("Invalid token");
  }
};

const getProfile = (req, res) => {
  const user = req.user;
  res.render("profile", { user });
};

// Product List
const homeView = async (req, res) => {
  const { category } = req.query;
  const user = req.user;

  let { limit, sort } = req.query;
  const { page = 1 } = req.query;
  limit = limit || 10;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  // Sort options
  const sortOptions = {};
  if (sort === "asc") {
    sortOptions.price = 1;
  } else if (sort === "desc") {
    sortOptions.price = -1;
  }

  const {
    docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
  } = await productsModel.paginate(filter, {
    limit,
    page,
    sort: sortOptions,
    lean: true,
  });

  let productsList = docs.slice(0, limit);

  res.render("home", {
    productsList: productsList,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
    currentSort: sort,
    user,
  });
};

const productView = async (req, res) => {
  const pid = req.params.pid;
  const user = req.user;
  const product = await getProductByIdService(pid);
  res.render("product", { product, user });
};

const getCategory = async (req, res) => {
  const { category } = req.params;

  let { limit } = req.query;
  const { page = 1 } = req.query;

  limit = limit || 10;

  const {
    docs,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
  } = await productsModel.paginate({ category }, { limit, page, lean: true });

  let productsList = docs.slice(0, limit);

  res.render("home", {
    productsList: productsList,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink,
    nextLink,
    user: req.session.user,
  });
};

const cartView = async (req, res) => {
  const cid = req.params.cid;
  const user = await getByEmailUserService(req.user.email);
  if (!user.carts.find(({ cart }) => cid === cart._id.toString())) {
    return res.redirect("/");
  }
  const result = await getCartByIdService(cid);
  const cart = result;

  let total = 0;
  let cant = 0;
  for (const { product, quantity } of cart.products) {
    total += product.price * quantity;
    cant += quantity;
  }

  res.render("carts", { cart: cart, user: req.user, total, cant });
};

const realtimeproductsView = async (req, res) => {
  const productsList = await getProductsService();
  res.render("realTimeProducts", {
    productsList: productsList,
    user: req.session.user,
  });
};

const chatRender = (req, res) => {
  res.render("chat");
};

const usersView = async (req, res) => {
  const users = (await getUsersService()).map((user) => ({
    name: user.first_name.trim() + " " + user.last_name.trim(),
    email: user.email,
    role: user.role,
    id: user._id,
  }));
  res.render("adminPanel", { user: req.user, users, roles: CARTS_ACCESS });
};

export {
  registerView,
  loginView,
  resetView,
  getProfile,
  homeView,
  getCategory,
  cartView,
  realtimeproductsView,
  chatRender,
  resetPasswordView,
  productView,
  usersView,
};
