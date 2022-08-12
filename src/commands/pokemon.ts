import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  IntegrationExpireBehavior,
} from "discord.js";
import axios from "axios";
import { join } from "path";

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
}

const getPokemon = new SlashCommandBuilder()
  .setName("pokemon")
  .setDescription("gets pokemon from poke api");

module.exports = {
  data: getPokemon,
  execute: async (interaction: ChatInputCommandInteraction) => {
    const pokeData = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    );
    const pokemon2: PokemonProfile = await fetchPokemon(
      pokeData.data.results[getRandomInt(0, pokeData.data.results.length)].url
    );
    const pokemon1 = new EmbedBuilder()
      .setTitle(pokemon2.name)
      .setImage(pokemon2.image)
      .setDescription(pokemon2.types.join())
      .setColor(typeMap.get(pokemon2.types[0]));
    await interaction.reply({ embeds: [pokemon1] });
  },
};

const fetchPokemon = async (pokemon: string) => {
  const singlePoke = await axios.get(pokemon);
  const numMoves = singlePoke.data.moves.length;
  const numAbilities = singlePoke.data.abilities.length;
  const retval: PokemonProfile = {
    name: singlePoke.data.name,
    image: singlePoke.data.sprites.front_default,
    types: singlePoke.data.types.map((type: any) => {
      return type.type.name;
    }),
    base_stat: singlePoke.data.stats[0].base_stat,
    ability: singlePoke.data.moves[getRandomInt(0, numAbilities)],
    skill: singlePoke.data.moves[getRandomInt(0, numMoves)],
  };
  return retval;
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
