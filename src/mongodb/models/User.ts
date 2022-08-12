import { Schema, model } from "mongoose";

const pokemonSchema = new Schema({});

const userSchema = new Schema({
  tag: {
    type: String,
    unique: true
  },
  pokemons: {
    type: [pokemonSchema]
  }
});

const User = model("User", userSchema);

module.exports = User;
