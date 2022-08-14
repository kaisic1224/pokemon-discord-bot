import { model, models, Schema } from "mongoose";

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

const Bank = models.Bank || model("Bank", bankSchema);

export default Bank;
