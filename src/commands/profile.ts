import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("View your own, or someone else's profile")
  .addUserOption((option) =>
    option.setName("user").setDescription("select a user to view their profile")
  );

module.exports = {
  data,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { client, member, options } = interaction;

    const user = options.get("user")?.user ?? member?.user;

    const embed = new EmbedBuilder()
      .setTitle(`${user?.username}#${user?.discriminator}`)
      .setThumbnail((user as User).displayAvatarURL())
      .setDescription(`${user?.username}'s profile`)
      .setFields([{ name: "\u200B", value: "xp: full\njaja: lmao" }]);

    await interaction.reply({ embeds: [embed] });
  }
};
