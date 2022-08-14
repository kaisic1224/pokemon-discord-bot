"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pokemonSchema = new mongoose_1.Schema({
    name: { type: String },
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
const userSchema = new mongoose_1.Schema({
    tag: {
        type: String,
        unique: true
    },
    pokemons: {
        type: [pokemonSchema]
    },
    lastClaimed: { type: Number },
    totalEncounters: { type: Number }
});
const User = mongoose_1.models.Mentor || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
