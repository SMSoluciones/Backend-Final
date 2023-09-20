import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Carts", () => {
  let cookie;
  let cartID;

  const mockEmail = "admin@admin.com";
  const passwordMock = "1234";
  const mockProduct = "649346bcbfe1a2b704318d08";

  before(async () => {
    const credentialsMock = {
      email: mockEmail,
      password: passwordMock,
    };

    const login = await requester
      .post("/api/users/login")
      .send(credentialsMock);
    const cookieResult = login.headers["set-cookie"][0];

    const cookieResultSplit = cookieResult.split("=");

    cookie = {
      name: cookieResultSplit[0],
      value: cookieResultSplit[1],
    };
  });

  it("POST a /api/carts/ se creara el carrito y verificara que devuelva su payload y Id correspondiente.", async () => {
    const { statusCode, _body } = await requester
      .post("/api/carts/")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.have.property("payload");
    expect(_body.payload).to.have.property("_id");
    cartID = _body.payload._id;
  });

  it("GET a /api/carts verificara que el carrito se cree mediante su ID.", async () => {
    const { statusCode, _body } = await requester
      .get(`/api/carts/${cartID}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(statusCode).to.be.equal(200);
    expect(_body).to.have.property("payload");
  });

  it("POST a /api/carts/ agregara al carrito un producto mockeado.", async () => {
    const result = await requester
      .post(`/api/carts/${cartID}/products/${mockProduct}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(result.statusCode).to.be.equal(200);
    expect(result._body).to.have.property("payload");
  });

  it("DELETE a /api/carts y borrar el carrito correctamente por su ID", async () => {
    const { statusCode, _body } = await requester
      .delete(`/api/carts/${cartID}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(statusCode).to.be.equal(200);
    expect(_body).to.have.property("payload");
  });
});
