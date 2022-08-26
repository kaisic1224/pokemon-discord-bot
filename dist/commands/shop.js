"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const mongo_1 = __importDefault(require("../mongodb/mongo"));
axios_1.default.defaults;
const shopCommand = new discord_js_1.SlashCommandBuilder()
    .setName("shop")
    .setDescription("Preview whstringat is on auction in the shop currently");
module.exports = {
    data: shopCommand,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield (yield axios_1.default.get("https://pokeapi.co/api/v2/item?limit=100000&offset=0")).data.results;
        yield interaction.deferReply();
        yield (0, mongo_1.default)();
        const shopEmbed = new discord_js_1.EmbedBuilder().setTitle("Shop").setDescription("LOL");
    })
};
