import DiscordJS, { BaseCommandInteraction, Client, Options } from "discord.js";
import { Command } from "src/types/Command";
import { MINIMUM_HIT_PRICE } from "src/constants";
import Hit from '../types/Hit'
import Player from '../types/Player'
import { hits, findPlayer } from '../database'

export const PlaceHit: Command = {
    name: "placehit",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    options: [
        {
            name: "target",
            description: "The in-game name of the target",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "price",
            description: `The price of the hit in diamonds. *Must be greater than ${MINIMUM_HIT_PRICE} diamonds.*`,
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = ""
        const { options } = interaction;

        const price = Number(options.get("price")?.value);
        if (price < MINIMUM_HIT_PRICE)
            content = `Price is too low! The Minimum price for a hit is ${MINIMUM_HIT_PRICE}`;
        else {
            // findPlayer(parseInt(interaction.user.id, 10))
            //     .then((p: Player) => {})
            //     .catch(err => {});
            
            if (placer == null)
                content = "You are NOT a registered user! Use \`/register\` to register so you can place hits (and have hits placed on you!)";
            else if (target == null)
                content = "Your target is NOT a registered user! They have to be registered to place hits on them!";
            else {
                hits.push(new Hit(placer, target, price));
                content = `Successfully placed new hit on player ${target.ign}`
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 