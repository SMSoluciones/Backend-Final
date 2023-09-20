import { faker } from "@faker-js/faker";

faker.locale = "es";

const fakeProductGenerator = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.random.alphaNumeric(6),
    price: faker.commerce.price(),
    thumbnail: faker.image.image(),
    stock: faker.random.numeric(1),
    category: faker.commerce.productMaterial(),
  };
};

export { fakeProductGenerator };
