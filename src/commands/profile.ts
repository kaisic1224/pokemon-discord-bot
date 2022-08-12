import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("View your own, or someone else's profile")
  .addUserOption((option) =>
    option.setName("user").setDescription("add a user here or not")
  );

module.exports = {
  data,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { command, member } = interaction;
    const embed = new EmbedBuilder().setTitle(
      member?.user.username! + "#" + member?.user.discriminator
    );
    await interaction.reply({ embeds: [embed] });
  }
};
