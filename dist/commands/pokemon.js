"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const mongo_1 = __importDefault(require("../mongodb/mongo"));
const User_1 = __importDefault(require("../mongodb/models/User"));
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
const getPokemon = new builders_1.SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("gets pokemon from poke api");
module.exports = {
    data: getPokemon,
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { member } = interaction;
        const pokeData = yield axios_1.default.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        const pokemon2 = yield fetchPokemon(pokeData.data.results[getRandomInt(0, pokeData.data.results.length)].url);
        const pokemon1 = new builders_1.EmbedBuilder()
            .setTitle(pokemon2.name.toUpperCase())
            .setImage(pokemon2.image)
            .setDescription(`${member === null || member === void 0 ? void 0 : member.user.username} was ${pokemon2.encounter.toLowerCase()}, and then...`)
            .setFields(pokemon2.types.map((type) => ({
            name: "\u200B",
            value: "```fix\n" +
                type.charAt(0).toUpperCase() +
                type.substring(1) +
                "```",
            inline: true
        })))
            .setColor(typeMap.get(pokemon2.types[0]));
        const confirmCatch = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setLabel("Catch")
            .setCustomId("Catch"), new builders_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setCustomId("Don't catch")
            .setLabel("Don't catch"));
        const filter = (i) => i.customId === "Catch" || i.customId === "Don't catch";
        const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
            filter: filter,
            time: 5000
        });
        collector === null || collector === void 0 ? void 0 : collector.on("collect", (i) => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                components: [
                    confirmCatch.setComponents(confirmCatch.components.map((button) => button.setDisabled()))
                ]
            });
            yield i.deferReply();
            yield (0, mongo_1.default)();
            if (i.customId === "Catch") {
                try {
                    const user = yield User_1.default.findOneAndUpdate({
                        tag: interaction.user.tag
                    }, {
                        tag: interaction.user.tag,
                        // add new pokemon to their array
                        $push: { pokemon: pokemon2 },
                        lastClaimed: 0,
                        // increase their encounter number by 1
                        $inc: { totalEncounters: 1 }
                    }, { upsert: true, new: true }).exec();
                    console.log(user);
                    yield i.editReply("YES MAN");
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                yield i.editReply(`The wild ${pokemon2.name} has escaped!`);
            }
        }));
        yield interaction.reply({ embeds: [pokemon1], components: [confirmCatch] });
    })
};
const fetchPokemon = (pokemon) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const singlePoke = yield axios_1.default.get(pokemon);
    const numMoves = singlePoke.data.moves.length;
    const numAbilities = singlePoke.data.abilities.length;
    // Fetch list of locations the pokemon could be in (comes in an array of locations)
    const pokeEncounter = yield axios_1.default.get(singlePoke.data.location_area_encounters);
    // Generate a random index out of the possible list of locations and select that specific location
    const randomArea = getRandomInt(0, pokeEncounter.data.length - 1);
    // Check if there is a valid location at that index, and use that as the encounter-method url, otherwise default any falsely values back to first encounter method
    const encounterUrl = ((_b = pokeEncounter.data[randomArea]) === null || _b === void 0 ? void 0 : _b.version_details[0].encounter_details[0].method.url) || "https://pokeapi.co/api/v2/encounter-method/1/";
    // Fetch the quote for encounter method but make sure it is in english
    const encounterMethodRes = yield axios_1.default.get(encounterUrl);
    const encounterMethod = encounterMethodRes.data.names.filter((item) => item.language.name === "en")[0].name;
    const retval = {
        name: singlePoke.data.name,
        image: singlePoke.data.sprites.front_default,
        types: singlePoke.data.types.map((type) => {
            return type.type.name;
        }),
        base_stat: singlePoke.data.stats[0].base_stat,
        ability: singlePoke.data.moves[getRandomInt(0, numAbilities)],
        skill: singlePoke.data.moves[getRandomInt(0, numMoves)],
        encounter: encounterMethod
    };
    return retval;
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
