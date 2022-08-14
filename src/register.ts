import "dotenv/config";
import {
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

interface command {
  data: SlashCommandBuilder;
  execute: Function;
}

const cmdsPath = path.join(__dirname, "commands");
const files = fs.readdirSync(cmdsPath);
const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

files
  .filter((file) => file.endsWith(".js"))
  .forEach((commandFile) => {
    const command: command = require("./commands/" +
      commandFile.substring(0, commandFile.length - 3));
    commands.push(command.data.toJSON());
  });

const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;
const token = process.env.BOT_TOKEN!;

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
