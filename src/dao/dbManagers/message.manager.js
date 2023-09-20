import { chatModel } from "../models/messages.model.js";

export default class MessageManager {
  getMessages = async () => {
    let result = await chatModel.find().lean();
    return result;
  };

  addMessage = async (data) => {
    let { user, message, id } = data;
    let result = await chatModel.create({ user, message, id });
    return result;
  };
}
