import "dotenv/config";
import { Client, GatewayIntentBits, blockQuote, Collection } from "discord.js";
import axios from "axios";
import { item } from "./commands/shop";
import Bank from "./mongodb/models/Bank";
import connectToDB from "./mongodb/mongo";
import Redis from "ioredis";
axios.defaults;
const getRandomInt = require("./commands/pokemon").getRandomInt;

const redis = new Redis(process.env.REDIS_URL!);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const refreshShop = async () => {
  await connectToDB();
  const itemResponse = await axios.get(
    "https://pokeapi.co/api/v2/item?limit=100000&offset=0"
  );
  const items: Array<Record<"name" | "url", any>> =
    itemResponse.data.results.slice(15);
  const shop: Array<Record<string, any>> = [];
  for (let index = 0; index < 8; index++) {
    let randomIndex = getRandomInt(0, items.length - 1);
    const resp = await axios.get(items[randomIndex].url);
    if ((resp.data as item).category.name === "asd") {
      console.log("first");
    }
    const profile = {
      name: (resp.data as item).name,
      flavour_text: (resp.data as item).flavor_text_entries.filter(
        (text) => text.language.name === "en"
      )[0].text,
      cost: (resp.data as item).cost,
      image: (resp.data as item).sprites.default,
      stock: 10000
    };
    shop.push(profile);
  }
  const newShop = await Bank.findOneAndUpdate(
    undefined,
    { items: shop },
    { upsert: true, new: true }
  ).exec();
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  refreshShop();
  setInterval(() => {
    refreshShop();
  }, 24 * 60 * 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  require("./commands/" + commandName).execute(interaction);
});

client.login(process.env.BOT_TOKEN);
