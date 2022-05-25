import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed, Options } from "discord.js";
import Command from "../../types/Command";
import { MINIMUM_HIT_PRICE } from "../../constants";
import Bounty from '../../types/Bounty';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN } from '../../database';
import logger from "../../logger";

const SetBounty: Command = {
    name: "setbounty",
    description: "Place a new bounty on someone 😈",
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
            description: `The price of the hit in diamonds. Must be greater than ${MINIMUM_HIT_PRICE} diamonds.`,
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const { options } = interaction;

        const price = Number(options.get("price")?.value);
        if (price < MINIMUM_HIT_PRICE)
            response.description = `Price is too low! *The Minimum price for a hit is ${MINIMUM_HIT_PRICE} diamonds.*`;
        else {
            const placer = findPlayerById(interaction.user.id);
            const target = findPlayerByIGN(String(options.get("target")?.value));
            const current_time: Date = new Date();

            // Placer is not registered
            if (!placer)
                response.description = "❌ You are NOT a registered user! Use \`/register\` to register so you can place hits (and have hits placed on you!)";

            // Target is not registered
            else if (!target)
                response.description = "❌ Your target is NOT a registered user! They have to be registered to place hits on them!";
            
            // Placer is still under cooldown
            else if (placer.hiringCooldown > 0)
                response.description = `⏱️ You are still under a cooldown! \`${placer.hiringCooldownString} left!\``;

            // Target is under cooldown
            else if (target.targetingCooldown > 0)
                response.description = `⏱️ Your target is still under a cooldown from being targeted for a hit. \`${target.targetingCooldownString} left.\``;

            // Target is already under effect of a hit
            else if (isTarget(target))
                response.description = "⏱️ Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.";

            // Success
            else {
                hits.push(new Bounty(placer, target, price, current_time));
                placer.lastPlacedHit = current_time;
                response.description = `✅ Successfully placed new hit on player ${target.ign}`;
                logger.info(`Player ${placer.ign} placed new hit on ${target.ign}`);
                save();
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}

export default SetBounty;