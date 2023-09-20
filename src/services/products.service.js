import {
  addProduct as addProductRepository,
  getProducts as getProductsRepository,
  getProductById as getProductByIdRepository,
  getProductByCode as getProductByCodeRepository,
  updateProduct as updateProductRepository,
  deleteProduct as deleteProductRepository,
} from "../repositories/products.repository.js"; // ✅

const addProduct = async (product) => {
  const exist = await getProductByCodeRepository(product.code);
  if (exist) throw new Error("Product already exists");

  const result = await addProductRepository(product);
  return result;
};

const getProducts = async (limit, page, query, sort) => {
  const products = await getProductsRepository(limit, page, query, sort);
  return products;
};

const getProductById = async (pid) => {
  const product = await getProductByIdRepository(pid);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (id, product) => {
  const updatedProduct = await updateProductRepository(id, product);

  if (!updatedProduct) {
    throw new Error("Product not found");
  }
  return updatedProduct;
};

const deleteProduct = async (pid) => {
  const result = await deleteProductRepository(pid);

  if (!result) {
    throw new Error("Product not found");
  }
  return result;
};

export {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
