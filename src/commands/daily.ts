import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import connectToDB from "../mongodb/mongo";
import User from "../mongodb/models/User";
import { getRandomInt } from "./pokemon";

const dailyCommand = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("get today's daily creds");

module.exports = {
  data: dailyCommand,
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    setTimeout(() => {}, 2000);
    await connectToDB();
    try {
      const user = await User.findOne({
        tag: interaction.user.tag,
      }).exec();
      console.log(user);
      const randomDaily = getRandomInt(2000, 6000);
      if (user.lastClaimed >= user.lastClaimed + 2 * 60 * 60 * 1000) {
        user.lastClaimed = Date.now();
        user.money += randomDaily;
      }
      await user.save();
      console.log(user);
      await interaction.editReply(
        `You have gained ${randomDaily} poke credits today! You can claim you next one in 2 hours`
      );
    } catch (err) {
      console.log(err);
    }
  },
};
