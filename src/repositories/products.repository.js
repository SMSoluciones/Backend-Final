import { PRODUCTSDAO } from "../dao/index.js"; // ✅

const addProduct = async (product) => {
  const newProduct = await PRODUCTSDAO.addProduct(product);
  return newProduct;
};

const getProducts = async (limit, page, query, sort) => {
  const products = await PRODUCTSDAO.getProducts(limit, page, query, sort);
  return products;
};

const getProductById = async (pid) => {
  const product = await PRODUCTSDAO.getProductById(pid);
  return product;
};

const getProductByCode = async (codeFind) => {
  const product = await PRODUCTSDAO.getProductByCode(codeFind);
  return product;
};

const updateProduct = async (id, product) => {
  const updatedProduct = await PRODUCTSDAO.updateProduct(id, product);
  return updatedProduct;
};

const deleteProduct = async (pid) => {
  const result = await PRODUCTSDAO.deleteProduct(pid);
  return result;
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductByCode,
};
