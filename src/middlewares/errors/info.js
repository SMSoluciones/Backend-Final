export const generateProductErrorInfo = (product) => {
  return `One or more propierties of product are invalid.
  List of required properties:
  - title: ${product.title}
  - description: ${product.description}
  - price: ${product.price}
  - stock: ${product.stock}
  - code: ${product.code}
  - category: ${product.category}
  `;
};
