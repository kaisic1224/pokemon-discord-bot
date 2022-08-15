import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const shopCommand = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Preview what is on auction in the shop currently");

module.exports = {
  data: shopCommand,
  execite: async (interaction: ChatInputCommandInteraction) => {}
};
