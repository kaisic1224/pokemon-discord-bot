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
const Bank_1 = __importDefault(require("../mongodb/models/Bank"));
axios_1.default.defaults;
const RARE_CANDY_URL = "https://static.wikia.nocookie.net/pokemon/images/5/53/Rare_Candy_Artwork.png/revision/latest/scale-to-width/360?cb=20110325230302";
const shopCommand = new discord_js_1.SlashCommandBuilder()
    .setName("shop")
    .setDescription("Preview whstringat is on auction in the shop currently");
module.exports = {
    data: shopCommand,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply();
        yield (0, mongo_1.default)();
        const shop = yield Bank_1.default.findOne();
        const dailyItems = shop.items.map((item) => {
            var _a;
            return new discord_js_1.EmbedBuilder()
                .setURL("https://www.discord.com")
                .setImage((_a = item.image) !== null && _a !== void 0 ? _a : RARE_CANDY_URL);
        });
        const shopEmbeds = [
            new discord_js_1.EmbedBuilder()
                .setTitle("Daily Shop")
                .setURL("https://www.discord.com"),
            ...dailyItems
        ];
        yield interaction.editReply({ embeds: shopEmbeds });
    })
};
