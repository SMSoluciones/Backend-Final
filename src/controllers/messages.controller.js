import {
  getMessages as getMessageService,
  addMessage as addMessageService,
} from "../services/message.service.js";

import { getLogger } from "../utils/logger.js";

// Get a messages
const getMessages = async (req, res) => {
  try {
    const messagesResult = await getMessageService();
    res.status(200).json({ status: "Success", payload: messagesResult });
  } catch (error) {
    getLogger().error(error.message);
    res.status(404).json({ status: "Error", payload: error });
  }
};
const addMessage = async (req, res) => {
  try {
    const { user, message, id } = req.body;
    const messageResult = await addMessageService({ user, message, id });
    res.status(200).json({ status: "Success", payload: messageResult });
  } catch (error) {
    getLogger().error(error.message);
    res.status(404).json({ status: "Error", payload: error });
  }
};

export { getMessages, addMessage };
