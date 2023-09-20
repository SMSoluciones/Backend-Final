import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    fs.existsSync(this.path)
      ? (this.products = JSON.parse(fs.readFileSync(this.path, "utf-8")))
      : (this.products = []);
  }

  //METHODS
  async addProduct(product) {
    // FIND ID
    if (this.products.length === 0) {
      product["id"] = 1;
    } else {
      product["id"] = this.products[this.products.length - 1]["id"] + 1;
    }

    this.products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, "\t")
    );
    return true;
  }

  // GET PRODUCTS
  getProduct() {
    return this.products;
  }

  // GET PRODUCTS BY ID
  getProductById(id) {
    let findById = this.products.find((p) => p.id === id);
    return findById;
  }

  // UPDATE PRODUCTS BY ID
  async updateProduct(id, value, newValue) {
    let findIndex = this.products.findIndex((e) => e.id === id);
    let validKeys;
    findIndex === -1
      ? false
      : (validKeys = Object.keys(this.products[findIndex]).some(
          (e) => e === value
        ));

    if (value === "id" || !validKeys) {
      return false;
    } else {
      this.products[findIndex][value] = newValue;
      await fs.writeFileSync(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );
      return true;
    }
  }

  // DELETE PRODUCTS BY ID
  deleteProduct(id) {
    let searchToDelete = this.products.some((p) => p.id === id);
    if (searchToDelete) {
      this.products = this.products.filter((e) => e.id !== id);
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
      return true;
    } else {
      return false;
    }
  }
}

export default new ProductManager("./data/products.json");
