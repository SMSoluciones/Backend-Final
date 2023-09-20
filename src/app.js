// Dependences
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

// Documentation
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

// Managers
import ProductManager from "./dao/dbManagers/products.manager.js";
import MessageManager from "./dao/dbManagers/message.manager.js";

// Routers
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import MessageRouter from "./routes/message.router.js";
import UsersRouter from "./routes/users.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import mockingRouter from "./routes/mocking.router.js";
import loggerTest from "./routes/loggerTest.router.js";

//Utils
import config from "./config/config.js";
import { addLogger, getLogger } from "./utils/logger.js";

const usersRouter = new UsersRouter();
const sessionsRouter = new SessionsRouter();
const viewsRouter = new ViewsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const messageRouter = new MessageRouter();

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

// Mongooose connection
const uri = config.mongoUrl;

try {
  await mongoose.connect(uri);
} catch (error) {
  getLogger().error(error);
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce Angelo Pastas - Documentación",
      description:
        "API pensada para resolver la compra de una tienda online de Pastas",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Server
const httpServer = app.listen(PORT, () => {
  getLogger().info(`Server running on port http://localhost:${PORT}`);
});

initializePassport();

// Sessions
const secret = config.secretSessionKey;
app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
    secret: secret,
    resave: true,
    saveUninitialized: true,
  })
);

//Logger middleware
app.use(addLogger);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", viewsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/messages", messageRouter.getRouter());
app.use("/mockingproducts", mockingRouter);
app.use("/loggerTest", loggerTest);

const hbs = handlebars.create({
  helpers: {
    ifEquals: (arg1, arg2, options) => {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    ifNotEquals: (arg1, arg2, options) => {
      return arg1 != arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// ProductManager Init
let productsOnList = new ProductManager();

//------------------SOCKET.IO------------------//

const io = new Server(httpServer);

// Products socket -----
io.on("connection", (socket) => {
  socket.on("newProduct", async (product) => {
    await productsOnList.addProduct(product);

    io.emit("updateProducts", await productsOnList.getProducts());
  });

  socket.on("deleteProduct", async (id) => {
    await productsOnList.deleteProduct(id);

    io.emit("updateProducts", await productsOnList.getProducts());
  });

  // Chat socket -----
  let messageManager = new MessageManager();
  const messages = [];
  getLogger().info("New user Connected");

  // Read event message
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
    messageManager.addMessage(data);
  });
  // Read event auth
  socket.on("auth", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUser", data);
  });
});
