import DiscordJS, { BaseCommandInteraction, Message, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { findContract, findPlayerById, findPlayerByIGN, hits, save } from "../../database"
import logger from "../../logger";

const RespondContract: Command = {
    name: "respondcontract",
    description: "Respond (accept/deny) to a contract.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "choice",
            description: "accept/deny",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "ign",
            description: "The in-game name of the person who is attempting to hire you for a contract.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("");
        const user = findPlayerById(interaction.user.id);
        const choice = String(interaction.options.get("choice")?.value);
        const hirer = findPlayerByIGN(String(interaction.options.get("ign")?.value));
        if (!user)
            response.setDescription("❌ You are not a registered user! Use \`/register\` to register!");
        else if (!hirer)
            response.setDescription("❌ Your selected hirer is not a registered user!");
        else if (choice != "accept" && choice != "deny")
            response.setDescription("❌ Your choice has to be either \'accept\' or \'deny\'.");
        else {
            const contract = findContract(hirer, user);
            if (!contract)
                response.setDescription(`❌ There are no pending contracts for you from ${hirer.ign} at this time.`);
            else {
                const hirer_response = new MessageEmbed();

                switch (choice) {
                    case "accept":
                        response.setDescription(`🟢 Accepted contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                        hirer_response.setDescription(`🟢 ${user.ign} accepted your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                        contract.pending = false;
                        save();
                        break;
                    case "deny":
                        response.setDescription(`🛑 Denied contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                        hirer_response.setDescription(`🛑 ${user.ign} denied your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                        hits.splice(hits.indexOf(contract), 1);
                        save();
                        break;
                }

                // DM hirer with contractor response
                Promise.resolve(client.users.fetch(hirer.discordId)).then((hirer_discord: DiscordJS.User | undefined) => {
                    if (hirer_discord === undefined)
                        logger.error(`User ${hirer.ign} has an invalid discord ID not found in bot cache. (@56-respondcontact.ts)`);
                    else {
                        try {
                            hirer_discord.send({ embeds: [ hirer_response ] });
                        }
                        catch (err: any) {
                            logger.warn(`Cannot message user ${hirer.ign}.`);
                        }
                    }
                });
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default RespondContract;