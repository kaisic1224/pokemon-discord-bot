import { VoiceConnectionStatus } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const {
  createAudioPlayer,
  getVoiceConnection,
  joinVoiceChannel
} = require("@discordjs/voice");

const playCmd = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song")
  .addStringOption((option) =>
    option.setName("name").setDescription("name or link of a song")
  );

module.exports = {
  data: playCmd,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const player = createAudioPlayer();
    const connection = joinVoiceChannel({
      channelId: interaction.channel?.id,
      guildId: interaction.guild?.id,
      adapterCreator: interaction.guild?.voiceAdapterCreator
    });

    const subscription = connection.subscribe();

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log("ready");
    });
  }
};
