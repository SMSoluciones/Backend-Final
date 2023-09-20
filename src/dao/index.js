import productsDao from "./dbManagers/products.manager.js";
import usersDao from "./dbManagers/users.manager.js";
import cartsDao from "./dbManagers/carts.manager.js";
import ticketsDao from "./dbManagers/tickets.manager.js";
import messagesDao from "./dbManagers/message.manager.js";

const MongoProducts = new productsDao();
const MongoUsers = new usersDao();
const MongoCarts = new cartsDao();
const MongoTickets = new ticketsDao();
const MessagesDao = new messagesDao();

export const PRODUCTSDAO = MongoProducts;
export const USERSDAO = MongoUsers;
export const CARTSDAO = MongoCarts;
export const TICKETSDAO = MongoTickets;
export const MESSAGESDAO = MessagesDao;
