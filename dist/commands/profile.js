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
const User_1 = __importDefault(require("../mongodb/models/User"));
const mongo_1 = __importDefault(require("../mongodb/mongo"));
const data = new discord_js_1.SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your own, or someone else's profile")
    .addUserOption((option) => option.setName("user").setDescription("select a user to view their profile"));
module.exports = {
    data,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { client, member, options } = interaction;
        yield interaction.deferReply();
        yield (0, mongo_1.default)();
        const user = (_b = (_a = options.get("user")) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : member === null || member === void 0 ? void 0 : member.user;
        const dbUser = yield User_1.default.find({
            tag: `${user === null || user === void 0 ? void 0 : user.username}#${user === null || user === void 0 ? void 0 : user.discriminator}`
        }).exec();
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`${user === null || user === void 0 ? void 0 : user.username}#${user === null || user === void 0 ? void 0 : user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`${user === null || user === void 0 ? void 0 : user.username}'s profile`)
            .setFields([
            { name: "\u200B", value: "xp: 🟩🟩🟩🟩🟩🟩" },
            { name: "\u200B", value: `Money: ${dbUser[0].money}` }
        ]);
        console.log(dbUser);
        yield interaction.editReply({ embeds: [embed] });
    })
};
