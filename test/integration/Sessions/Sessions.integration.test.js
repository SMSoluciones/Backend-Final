import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Session", () => {
  let cookie;

  const mockEmail = "admin@admin.com";
  const passwordMock = "1234";

  it("POST a /api/users/register intentara registrar un nuevom usuario con los datos mockeados", async () => {
    const userMock = {
      first_name: "Admin",
      last_name: "ADMIN",
      age: 33,
      email: mockEmail,
      password: passwordMock,
      role: "ADMIN",
    };

    const { statusCode, _body } = await requester
      .post("/api/users/register")
      .send(userMock);
    expect(statusCode).to.be.eql(200);
    expect(_body).to.be.ok;
  }).timeout(10000);

  it("POST /api/users/login intentara loguear un usuario mockeado y el mismo devolvera una cookie.", async () => {
    const loginMock = {
      email: mockEmail,
      password: passwordMock,
    };

    const loginResult = await requester
      .post("/api/users/login")
      .send(loginMock);
    const cookieResult = loginResult.headers["set-cookie"][0];

    expect(cookieResult).to.be.ok;

    const cookieResultSplit = cookieResult.split("=");

    cookie = {
      name: cookieResultSplit[0],
      value: cookieResultSplit[1],
    };

    expect(cookie.name).to.be.ok.and.eql("coderCookieToken");
    expect(cookie.value).to.be.ok;
  });

  it("GET /api/sessions/current traera mediante la cookie el mail del usuario y lo comparara con el mockeado.", async () => {
    const { _body } = await requester
      .get("/api/sessions/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(_body.data.email).to.be.eql(mockEmail);
  });
});
