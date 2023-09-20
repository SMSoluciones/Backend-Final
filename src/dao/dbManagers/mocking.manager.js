import mockingModel from "../models/mocking.model.js";
import { faker } from "@faker-js/faker";
import { fakeProductGenerator } from "../../mocks/fakeProducts.js";

faker.locale = "es";

export default class MockingManager {
  getProducts = async () => {
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push(fakeProductGenerator());
    }
    return products;
  };

  getProductById = async (id) => {
    const findById = await mockingModel.findOne({ _id: id }).lean();
    return findById;
  };

  addProduct = async (product) => {
    const createProduct = await mockingModel.create(product);
    return createProduct;
  };

  updateProduct = async (productId, newProduct) => {
    const findAndUpdate = await mockingModel.findByIdAndUpdate(
      productId,
      newProduct
    );
    return findAndUpdate;
  };

  deleteProduct = async (id) => {
    let findAndDelete = await mockingModel.deleteOne({ _id: id });
    return findAndDelete;
  };
}
