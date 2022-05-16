import DiscordJS, { BaseCommandInteraction, Client, Options } from "discord.js";
import Command from "src/types/Command";
import { MINIMUM_HIT_PRICE } from "../constants";
import Hit from '../types/Hit';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN } from '../database';
import logger from "../logger";

const PlaceHit: Command = {
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
            const placer = findPlayerById(interaction.user.id);
            const target = findPlayerByIGN(String(options.get("target")?.value));
            const current_time: Date = new Date();

            // Placer is not registered
            if (!placer)
                content = "You are NOT a registered user! Use \`/register\` to register so you can place hits (and have hits placed on you!)";

            // Target is not registered
            else if (!target)
                content = "Your target is NOT a registered user! They have to be registered to place hits on them!";

            // Target is Self
            else if (placer.equals(target))
                content = "You cannot place a hit on yourself! *(unless you\'re into that sort of thing...)*";
            
            // Placer is still under cooldown
            else if (placer.hiringCooldown > 0)
                content = `You are still under a cooldown! \`${placer.hiringCooldownString} left!\``;

            // Target is under cooldown
            else if (target.targetingCooldown > 0)
                content = `Your target is still under a cooldown from being targeted for a hit. \`${target.targetingCooldownString} left.\``;

            // Target is already under effect of a hit
            else if (isTarget(target))
                content = "Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.";

            // Success
            else {
                hits.push(new Hit(placer, target, price, current_time));
                placer.lastPlacedHit = current_time;
                content = `Successfully placed new hit on player ${target.ign}`;
                logger.info(`Player ${placer.ign} placed new hit on ${target.ign}`);
                save();
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}

export default PlaceHit;