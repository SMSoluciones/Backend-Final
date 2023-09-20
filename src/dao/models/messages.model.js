import mongoose from "mongoose";

const chatCollection = "messages";

const chatSchema = new mongoose.Schema({
  user: { type: String, require: true },
  message: { type: String, require: true },
  id: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

export const chatModel = mongoose.model(chatCollection, chatSchema);
