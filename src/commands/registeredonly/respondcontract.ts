import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { findContract, findPlayerById, findPlayerByIGN } from "../../database"

const RespondContract: Command = {
    name: "contract",
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
        const hirer = findPlayerByIGN(String(interaction.options.get("choice")?.value));
        if (!user)
            response.setDescription("❌ You are not a registered user! Use \`/register\` to register!");
        else if (!hirer)
            response.setDescription("❌ Your selected hirer is not a registered user!");
        else if (choice != "accept" && choice != "deny")
            response.setDescription("❌ Your choice has to be either \'accept\' or \'deny\'.");
        else {
            const contract = findContract(hirer, user);
            if (!contract)
                response.setDescription("❌ There are no pending contracts for you at this time.");
            else {
                switch (choice) {
                    case "accept":
                        response.setDescription(`🟢 Accepted contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                        break;
                    case "deny":
                        response.setDescription(`🛑 Denied contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                        break;
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default RespondContract;