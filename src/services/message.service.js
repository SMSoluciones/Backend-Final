import {
  getMessages as getMessagesRepository,
  addMessage as addMessageRepository,
} from "../repositories/messages.repository.js";

const getMessages = async () => {
  const messages = await getMessagesRepository();
  return messages;
};

const addMessage = async (data) => {
  const message = await addMessageRepository(data);
  return message;
};

export { getMessages, addMessage };
