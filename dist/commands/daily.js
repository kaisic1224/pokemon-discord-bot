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
const builders_1 = require("@discordjs/builders");
const mongo_1 = __importDefault(require("../mongodb/mongo"));
const User_1 = __importDefault(require("../mongodb/models/User"));
const pokemon_1 = require("./pokemon");
const dailyCommand = new builders_1.SlashCommandBuilder()
    .setName("daily")
    .setDescription("get today's daily creds");
module.exports = {
    data: dailyCommand,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply();
        yield (0, mongo_1.default)();
        try {
            const user = yield User_1.default.findOne({
                tag: interaction.user.tag
            }).exec();
            console.log(user);
            const randomDaily = (0, pokemon_1.getRandomInt)(2000, 6000);
            if (user.lastClaimed >= user.lastClaimed + 2 * 60 * 60 * 1000) {
                user.lastClaimed = Date.now();
                user.money += randomDaily;
            }
            yield user.save();
            console.log(user);
            yield interaction.editReply(`You have gained ${randomDaily} poke credits today! You can claim you next one in 2 hours`);
        }
        catch (err) {
            console.log(err);
        }
    })
};
