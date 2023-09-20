import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    fs.existsSync(this.path)
      ? (this.cart = JSON.parse(fs.readFileSync(this.path, "utf-8")))
      : (this.cart = []);
  }

  //METHODS

  // Create Cart
  async addCart() {
    let carts = {
      products: [],
    };

    if (this.cart.length === 0) {
      carts["id"] = 1;
    } else {
      carts["id"] = this.cart[this.cart.length - 1]["id"] + 1;
    }

    this.cart.push(carts);
    await fs.writeFileSync(this.path, JSON.stringify(this.cart, null, "\t"));
  }

  // Add Product to Cart
  async addProductToCart(id, pid, quantity) {
    let carts = this.cart.find((c) => c.id === id);
    let product = {
      id: pid,
      quantity: quantity,
    };

    // If product already exists in cart, update quantity
    let productIndex = carts.products.findIndex((p) => p.id === pid);
    if (productIndex !== -1) {
      carts.products[productIndex].quantity += quantity;
      await fs.writeFileSync(this.path, JSON.stringify(this.cart, null, "\t"));
      return true;
    }

    if (carts) {
      carts.products.push(product);
      await fs.writeFileSync(this.path, JSON.stringify(this.cart, null, "\t"));
      return true;
    } else {
      return false;
    }
  }

  // Get Cart
  getCart(id) {
    let carts = this.cart.find((c) => c.id === id);
    return carts || false;
  }
}

export default new CartManager("./data/carts.json");
