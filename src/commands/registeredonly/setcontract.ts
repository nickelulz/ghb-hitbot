import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed, Options } from "discord.js";
import Command from "../../types/Command";
import { MINIMUM_HIT_PRICE } from "../../constants";
import Contract from '../../types/Contract';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN, isContractor } from '../../database';
import logger from "../../logger";
import { client } from "../../main";

const SetContract: Command = {
    name: "setcontract",
    description: "Place a new contract on someone 😈",
    type: "CHAT_INPUT",
    options: [
        {
            name: "target",
            description: "The in-game name of the target",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "contractor",
            description: "The in-game name of  the intended contractor",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "price",
            description: `The price of the hit in diamonds. Must be greater than ${MINIMUM_HIT_PRICE} diamonds.`,
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "privacy",
            description: "Whether or not the purchaser of this hit will be visible to the public.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.BOOLEAN
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
            const contractor = findPlayerByIGN(String(options.get("contractor")?.value));
            const current_time: Date = new Date();
            const publicity: boolean = Boolean(options.get("privacy")?.value);

            // Placer is not registered
            if (!placer)
                response.description = "❌ You are NOT a registered user! Use \`/register\` to register so you can place hits (and have hits placed on you!)";

            // Target is not registered
            else if (!target)
                response.description = "❌ Your target is NOT a registered user! They have to be registered to place hits on them!";

            // Contractor is not registered
            else if (!contractor)
                response.description = "❌ Your intended contractor is NOT a registered user! They have to be registered to contract with them!";

            // Target is Self
            else if (placer.equals(target))
                response.description = "❌ You cannot place a hit on yourself! *(unless you\'re into that sort of thing...)*";
            
            // Placer is still under cooldown
            else if (placer.hiringCooldown > 0)
                response.description = `⏱️ You are still under a cooldown! \`${placer.hiringCooldownString} left!\``;

            // Target is under cooldown
            else if (target.targetingCooldown > 0)
                response.description = `⏱️ Your target is still under a cooldown from being targeted for a hit. \`${target.targetingCooldownString} left.\``;

            // Target is already under effect of a hit
            else if (isTarget(target))
                response.description = "⏱️ Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.";

            // Contractor already has an active contract
            else if (isContractor(contractor))
                response.description = "❌ Your contractor already has an active contract!";

            // Success
            else {
                hits.push(new Contract(placer, target, price, current_time, contractor, publicity));
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

export default SetContract;