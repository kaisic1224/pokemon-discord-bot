import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} from "discord.js";
import axios from "axios";
import connectToDB from "../mongodb/mongo";
import Bank from "../mongodb/models/Bank";
axios.defaults;

type attribute =
  | "countable"
  | "consumable"
  | "usable-in-battle"
  | "holdable"
  | "stat-boosts"
  | "medicine"
  | "standard-balls"
  | "other"
  | "dynamax-crystals"
  | "curry-ingredients"
  | "nature-mints"
  | "jewels"
  | "data-cards"
  | "apricorn-box"
  | "apricorn-balls"
  | "flutes"
  | "mulch"
  | "status-cures"
  | "revival"
  | "pp-recovery"
  | "healing"
  | "vitamins"
  | "loot"
  | "unused"
  | "type-enhancement"
  | "species-specific"
  | "plates"
  | "training"
  | "bad-held-items"
  | "effort-training"
  | "choice"
  | "held-items"
  | "evolution"
  | "collectibles"
  | "baking-only"
  | "picky-healing"
  | "in-a-pinch"
  | "effort-drop"
  | "type-protection";

export interface item {
  attributes: { name: attribute; url: string }[];
  category: {
    name: string;
    url: string;
  };
  cost: number;
  effect_entries: {
    effect: string;
    language: { name: string; url: string };
    short_effect?: string;
  }[];
  flavor_text_entries: {
    language: { name: string; url: string };
    text: string;
    version_group: { name: string; url: string };
  }[];
  fling_power: number | null;
  fling_effect: {
    id: number;
    name: string;
    categories: { name: string; url: string }[];
    names: { name: string; language: { name: string; url: string } };
  };
  id: number;
  game_indicies: {
    game_index: number;
    generation: { name: string; url: string };
  };
  name: string;
  names: { language: { name: string; url: string }; name: string }[];
  sprites: {
    default: string;
  };
}

export interface itemProfile {
  name: string;
  flavour_text: string;
  cost: number;
  image: string | null;
  stock: number;
}

const RARE_CANDY_URL =
  "https://static.wikia.nocookie.net/pokemon/images/5/53/Rare_Candy_Artwork.png/revision/latest/scale-to-width/360?cb=20110325230302";

const shopCommand = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Preview whstringat is on auction in the shop currently");

module.exports = {
  data: shopCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    await connectToDB();
    const shop: Record<"items", Array<itemProfile>> | null =
      await Bank.findOne();
    const dailyItems = shop!.items
      .slice(0, 4)
      .map((item) =>
        new EmbedBuilder()
          .setURL("https://www.discord.com")
          .setImage(item.image ?? RARE_CANDY_URL)
      );
    const shopEmbeds = [
      new EmbedBuilder()
        .setTitle("Daily Shop")
        .setURL("https://www.discord.com"),
      ...dailyItems
    ];
    await interaction.editReply({ embeds: shopEmbeds });
  }
};
