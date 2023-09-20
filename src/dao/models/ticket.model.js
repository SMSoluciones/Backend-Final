import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  purchase_datetime: {
    type: String,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
  products: {
    type: Array,
    default: [],
  },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
