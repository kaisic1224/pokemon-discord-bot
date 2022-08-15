import { Schema, model, models } from "mongoose";

const pokemonSchema = new Schema({
  name: { type: String, uppercase: true },
  image: { type: String },
  types: { type: [String] },
  base_stat: { type: Number },
  ability: {
    name: { type: String },
    url: { type: String }
  },
  skill: {
    name: { type: String },
    url: { type: String }
  },
  encounter: { type: String }
});

const userSchema = new Schema({
  tag: {
    type: String,
    unique: true
  },
  pokemon: {
    type: [pokemonSchema]
  },
  lastClaimed: { type: Number, default: 0 },
  totalEncounters: { type: Number },
  money: { type: Number, default: 0 }
});

const User = models.Mentor || model("User", userSchema);

export default User;
