"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pokemonSchema = new mongoose_1.Schema({
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
const itemSchema = new mongoose_1.Schema({
    count: { type: Number },
    name: { type: String },
    effect: { type: String },
    cost: { type: Number },
    image: { type: String }
});
const bagSchema = new mongoose_1.Schema({
    items: {
        countable: { type: [itemSchema] }
    }
});
const userSchema = new mongoose_1.Schema({
    tag: {
        type: String,
        unique: true
    },
    pokemon: {
        type: [pokemonSchema]
    },
    lastClaimed: { type: Number, default: 0 },
    totalEncounters: { type: Number },
    money: { type: Number, default: 0 },
    inventory: { type: bagSchema }
});
const User = mongoose_1.models.Mentor || (0, mongoose_1.model)("User", userSchema);
exports.default = User;
