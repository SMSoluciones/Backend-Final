import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Products", () => {
  let cookie;
  let productID;

  const mockEmail = "admin@admin.com";
  const passwordMock = "1234";

  const productMock = {
    title: "Empanada Inventada",
    description: "Empanada Fantasma",
    category: "Empanadas",
    price: 1000,
    thumbnail: "No image",
    code: "PR202",
    stock: 200,
  };

  before(async () => {
    const credentialsMock = {
      email: mockEmail,
      password: passwordMock,
    };

    const loginResult = await requester
      .post("/api/users/login")
      .send(credentialsMock);
    const cookieResult = loginResult.headers["set-cookie"][0];

    const cookieResultSplit = cookieResult.split("=");

    cookie = {
      name: cookieResultSplit[0],
      value: cookieResultSplit[1],
    };
  });

  it("POST a /api/products se intentara crear el producto y recibir un ID del mismo.", async () => {
    const { statusCode, _body } = await requester
      .post("/api/products/")
      .send(productMock)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.have.property("payload");
    expect(_body.payload).to.have.property("_id");
    productID = _body.payload._id;
  });

  it("GET a /api/products se verificara que los productos se obtienen correctamente.", async () => {
    const { statusCode, _body } = await requester
      .get("/api/products/")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(statusCode).to.be.equal(200);
    expect(Array.isArray(_body.payload)).to.be.equal(true);
    expect(_body).to.have.property("payload");
  });

  it("DELETE a /api/products se borrara el producto antes creado mediante su ID", async () => {
    const deleteResult = await requester
      .delete(`/api/products/${productID}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(deleteResult.statusCode).to.be.equal(200);
  });
});
