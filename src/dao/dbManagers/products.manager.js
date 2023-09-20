import productsModel from "../models/products.model.js";

export default class ProductManager {
  getProducts = async () => {
    const products = await productsModel.find().lean();
    return products;
  };

  getProductById = async (id) => {
    const findById = await productsModel.findOne({ _id: id }).lean();
    return findById;
  };

  // addProducts = async (product) => {
  //   if (product.status === undefined) {
  //     product.status = true;
  //   }

  //   const result = await productModel.create(product);
  //   return result;
  // };

  addProduct = async (product) => {
    const createProduct = await productsModel.create(product);
    return createProduct;
  };

  updateProduct = async (productId, newProduct) => {
    const findAndUpdate = await productsModel.findByIdAndUpdate(
      productId,
      newProduct
    );
    return findAndUpdate;
  };

  getProductByCode = async (codeFind) => {
    const product = await productsModel.findOne({ code: codeFind }).lean();
    return product;
  };

  deleteProduct = async (pid) => {
    const result = await productsModel.findByIdAndDelete(pid);
    return result;
  };
}
