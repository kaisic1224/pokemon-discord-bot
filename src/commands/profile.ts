import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User as discordUser
} from "discord.js";
import User from "../mongodb/models/User";
import connectToDB from "../mongodb/mongo";

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
    await interaction.deferReply();
    await connectToDB();

    const user = options.get("user")?.user ?? member?.user;

    const dbUser = await User.find({
      tag: `${user?.username}#${user?.discriminator}`
    }).exec();

    const embed = new EmbedBuilder()
      .setTitle(`${user?.username}#${user?.discriminator}`)
      .setThumbnail((user as discordUser).displayAvatarURL())
      .setDescription(`${user?.username}'s profile`)
      .setFields([
        { name: "\u200B", value: "xp: 🟩🟩🟩🟩🟩🟩" },
        { name: "\u200B", value: `Money: ${dbUser[0].money}` }
      ]);
    console.log(dbUser);

    await interaction.editReply({ embeds: [embed] });
  }
};
