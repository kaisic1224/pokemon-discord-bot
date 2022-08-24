import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} from "discord.js";
import axios from "axios";
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

const shopCommand = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Preview whstringat is on auction in the shop currently");

module.exports = {
  data: shopCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const items = await (
      await axios.get("https://pokeapi.co/api/v2/item?limit=100000&offset=0")
    ).data.results;
    const shopEmbed = new EmbedBuilder().setTitle("Shop").setDescription("LOL");
  }
};
