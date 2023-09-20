import ticketModel from "../models/ticket.model.js";
import { getLogger } from "../../utils/logger.js";

export default class TicketManager {
  updateTicket = async (codeUnic, fechaHora, amount, user, ticketProducts) => {
    const ticket = await ticketModel.create({
      code: codeUnic,
      purchase_datetime: fechaHora,
      amount: amount,
      purchaser: user.email,
      products: ticketProducts,
    });
    return ticket;
  };
}
