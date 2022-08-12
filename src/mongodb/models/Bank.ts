import { model, Schema } from "mongoose";

const bankSchema = new Schema({
  items: {
    type: [
      {
        name: { type: String },
        stock: { type: Number }
      }
    ]
  }
});

const Bank = model("Bank", bankSchema);

module.exports = Bank;
