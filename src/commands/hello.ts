import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

const helloCommand = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("responds with hello");

module.exports = {
  data: helloCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    setTimeout(() => {}, 2000);
    await interaction.editReply("hello");
  }
};
