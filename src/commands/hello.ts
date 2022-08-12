import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

const helloCommand = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("responds with hello");

module.exports = {
  data: helloCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("hello");
  },
};
