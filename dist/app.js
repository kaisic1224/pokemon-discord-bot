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
require("dotenv/config");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const Bank_1 = __importDefault(require("./mongodb/models/Bank"));
const mongo_1 = __importDefault(require("./mongodb/mongo"));
axios_1.default.defaults;
const getRandomInt = require("./commands/pokemon").getRandomInt;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
const refreshShop = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_1.default)();
    const itemResponse = yield axios_1.default.get("https://pokeapi.co/api/v2/item?limit=100000&offset=0");
    const items = itemResponse.data.results.slice(15);
    const shop = [];
    for (let index = 0; index < 8; index++) {
        let randomIndex = getRandomInt(0, items.length - 1);
        const resp = yield axios_1.default.get(items[randomIndex].url);
        if (resp.data.category.name === "dynamax-crystals") {
            index--;
            continue;
        }
        const profile = {
            name: resp.data.name,
            flavour_text: resp.data.flavor_text_entries.filter((text) => text.language.name === "en")[0].text,
            cost: resp.data.cost,
            image: resp.data.sprites.default,
            stock: 10000
        };
        shop.push(profile);
    }
    const newShop = yield Bank_1.default.findOneAndUpdate(undefined, { items: shop }, { upsert: true, new: true }).exec();
});
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    refreshShop();
    setInterval(() => {
        refreshShop();
    }, 24 * 60 * 60 * 1000);
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    require("./commands/" + commandName).execute(interaction);
}));
client.login(process.env.BOT_TOKEN);
