import "dotenv/config";
import { Client, GatewayIntentBits, blockQuote } from "discord.js";
import axios from "axios";
axios.defaults;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { command, member, commandName } = interaction;

  require("./commands/" + commandName).execute(interaction);
});

client.login(process.env.BOT_TOKEN);
