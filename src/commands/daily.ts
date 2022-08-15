import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import connectToDB from "../mongodb/mongo";
import User from "../mongodb/models/User";

const dailyCommand = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("get today's daily creds");

module.exports = {
  data: dailyCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    await connectToDB();
    try {
      const user = await User.findOne({
        tag: interaction.user.tag
      }).exec();
      console.log(user);
      await interaction.editReply("Hello tracer is here!");
    } catch (err) {
      console.log(err);
    }
  }
};
