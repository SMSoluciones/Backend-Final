import { MESSAGESDAO } from "../dao/index.js";

const getMessages = async () => {
  const messages = await MESSAGESDAO.getMessages();
  return messages;
};

const addMessage = async (data) => {
  const message = await MESSAGESDAO.addMessage(data);
  return message;
};

export { getMessages, addMessage };
