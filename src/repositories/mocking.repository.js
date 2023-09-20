import { MOCKINGDAO } from "../dao/index.js"; // ✅

const addProduct = async (product) => {
  const newProduct = await MOCKINGDAO.addProduct(product);
  return newProduct;
};

const getProducts = async () => {
  const products = await MOCKINGDAO.getProducts();
  return products;
};

const getProductById = async (pid) => {
  const product = await MOCKINGDAO.getProductById(pid);
  return product;
};

const updateProduct = async (id, product) => {
  const updatedProduct = await MOCKINGDAO.updateProduct(id, product);
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const result = await MOCKINGDAO.deleteProduct(id);
  return result;
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
