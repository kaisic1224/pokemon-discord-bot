import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder
} from "@discordjs/builders";
import {
  ActionRowBuilder,
  APIMessageComponentEmoji,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageComponentInteraction
} from "discord.js";
import axios from "axios";
import connectToDB from "../mongodb/mongo";
import User from "../mongodb/models/User";

const typeMap = new Map();
typeMap.set("normal", [168, 168, 120]);
typeMap.set("fire", [240, 128, 48]);
typeMap.set("fighting", [192, 48, 40]);
typeMap.set("water", [104, 144, 240]);
typeMap.set("flying", [168, 144, 240]);
typeMap.set("grass", [120, 200, 80]);
typeMap.set("poison", [160, 64, 160]);
typeMap.set("electric", [248, 208, 48]);
typeMap.set("ground", [224, 192, 104]);
typeMap.set("psychic", [248, 88, 136]);
typeMap.set("rock", [184, 160, 56]);
typeMap.set("ice", [152, 216, 216]);
typeMap.set("bug", [168, 184, 32]);
typeMap.set("dragon", [112, 56, 248]);
typeMap.set("ghost", [112, 88, 152]);
typeMap.set("dark", [112, 88, 72]);
typeMap.set("steel", [184, 184, 208]);
typeMap.set("fairy", [238, 153, 172]);

interface Move {
  name: string;
  url: string;
}

interface Ability {
  name: string;
  url: string;
}

interface PokemonProfile {
  name: string;
  image: string;
  types: string[];
  base_stat: number;
  ability: Ability;
  skill: Move;
  encounter: string;
}

const getPokemon = new SlashCommandBuilder()
  .setName("pokemon")
  .setDescription("gets pokemon from poke api");

module.exports = {
  data: getPokemon,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { member } = interaction;
    const pokeData = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    );
    const pokemon2: PokemonProfile = await fetchPokemon(
      pokeData.data.results[getRandomInt(0, pokeData.data.results.length)].url
    );

    const pokemon1 = new EmbedBuilder()
      .setTitle(pokemon2.name.toUpperCase())
      .setImage(pokemon2.image)
      .setDescription(
        `${
          member?.user.username
        } was ${pokemon2.encounter.toLowerCase()}, and then...`
      )
      .setFields(
        pokemon2.types.map((type) => ({
          name: "\u200B",
          value:
            "```fix\n" +
            type.charAt(0).toUpperCase() +
            type.substring(1) +
            "```",
          inline: true
        }))
      )
      .setColor(typeMap.get(pokemon2.types[0]));

    const confirmCatch = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel("Catch")
        .setCustomId("Catch"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("Don't catch")
        .setLabel("Don't catch")
    );

    const filter = (i: MessageComponentInteraction) =>
      i.customId === "Catch" || i.customId === "Don't catch";

    const collector = interaction.channel?.createMessageComponentCollector({
      filter: filter,
      time: 5000
    });

    collector?.on("collect", async (i) => {
      // Set buttons to disabled
      await interaction.editReply({
        components: [
          confirmCatch.setComponents(
            confirmCatch.components.map((button) => button.setDisabled())
          )
        ]
      });
      // Make the bot send a thinking message so message does not expire while it connects to database and queries other informations
      await i.deferReply();
      await connectToDB();

      if (i.customId === "Catch") {
        // if they choose to catch, find the document and update it, but create it if it doesn't exist
        try {
          const user = await User.findOneAndUpdate(
            {
              tag: interaction.user.tag
            },
            {
              tag: interaction.user.tag,
              // add new pokemon to their array
              $push: { pokemon: pokemon2 },
              lastClaimed: 0,
              // increase their encounter number by 1
              $inc: { totalEncounters: 1 }
            },
            { upsert: true, new: true }
          ).exec();
          console.log(user);
          await i.editReply(
            `${interaction.user.tag} has caught ${pokemon2.name} sucessfully!`
          );
          const pokemonName =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setEmoji({ name: "\u2714" })
                .setCustomId("Yes"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("Don't catch")
                .setEmoji({ name: "\u2716" })
            );
          await i.followUp({
            content: `Would you like to give it a name?`,
            components: [pokemonName]
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        await i.editReply(`The wild ${pokemon2.name} has escaped!`);
      }
    });

    await interaction.reply({ embeds: [pokemon1], components: [confirmCatch] });
  }
};

const fetchPokemon = async (pokemon: string) => {
  const singlePoke = await axios.get(pokemon);
  const numMoves = singlePoke.data.moves.length;
  const numAbilities = singlePoke.data.abilities.length;

  // Fetch list of locations the pokemon could be in (comes in an array of locations)
  const pokeEncounter = await axios.get(
    singlePoke.data.location_area_encounters
  );
  // Generate a random index out of the possible list of locations and select that specific location
  const randomArea = getRandomInt(0, pokeEncounter.data.length - 1);

  // Check if there is a valid location at that index, and use that as the encounter-method url, otherwise default any falsely values back to first encounter method
  const encounterUrl =
    pokeEncounter.data[randomArea]?.version_details[0].encounter_details[0]
      .method.url || "https://pokeapi.co/api/v2/encounter-method/1/";

  // Fetch the quote for encounter method but make sure it is in english
  const encounterMethodRes = await axios.get(encounterUrl);
  const encounterMethod = encounterMethodRes.data.names.filter(
    (item: any) => item.language.name === "en"
  )[0].name;

  const retval: PokemonProfile = {
    name: singlePoke.data.name,
    image: singlePoke.data.sprites.front_default,
    types: singlePoke.data.types.map((type: any) => {
      return type.type.name;
    }),
    base_stat: singlePoke.data.stats[0].base_stat,
    ability: singlePoke.data.moves[getRandomInt(0, numAbilities)],
    skill: singlePoke.data.moves[getRandomInt(0, numMoves)],
    encounter: encounterMethod
  };
  return retval;
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
