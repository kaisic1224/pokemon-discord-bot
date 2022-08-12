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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cmdsPath = path_1.default.join(__dirname, "commands");
const files = fs_1.default.readdirSync(cmdsPath);
const commands = [];
files
    .filter((file) => file.endsWith(".js"))
    .forEach((commandFile) => {
    const command = require("./commands/" +
        commandFile.substring(0, commandFile.length - 3));
    commands.push(command.data.toJSON());
});
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;
const rest = new discord_js_1.REST({ version: "10" }).setToken(token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Started refreshing application (/) commands.");
        yield rest.put(discord_js_1.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands
        });
        console.log("Successfully reloaded application (/) commands.");
    }
    catch (error) {
        console.error(error);
    }
}))();
