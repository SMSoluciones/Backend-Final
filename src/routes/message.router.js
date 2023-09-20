import Router from "./router.js";
import { getMessages, addMessage } from "../controllers/messages.controller.js";
import { PRIVATE_ACCESS } from "../config/access.js";

import { passportStrategiesEnum } from "../config/enums.js";

export default class MessageRouter extends Router {
  init() {
    this.get("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, getMessages);

    this.post("/", PRIVATE_ACCESS, passportStrategiesEnum.JWT, addMessage);
  }
}
