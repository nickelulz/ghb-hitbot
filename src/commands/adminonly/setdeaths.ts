import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import { findPlayerById, findPlayerByIGN, save } from "../../database";
import Command from "../../types/Command";

const SetDeaths: Command = {
    name: "setdeaths",
    description: "Set the deaths of a user. Requires administrator permissions.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The IGN of the user to be changed",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "amount",
            description: "The amount to set the user\'s deaths to",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = findPlayerById(interaction.user.id);
        const target = findPlayerByIGN(String(interaction.options.get("ign")?.value));
        const amount = Number(interaction.options.get("amount")?.value);
        let content: string = "";
        
        // User not registered/not found
        if (!user)
            content = "❌ You are not a registered user! (make sure to use \`/register\` to register!)";

        // Target not registered/not found
        else if (!target)
            content = "❌ The user you selected to change is not registered!";
        
        // User is not an admin
        else if (!user.isAdmin)
            content = "❌ You are not an administrator!";

        // Successful
        else {
            target.deathCount = amount;
            content = `✅ Set user ${target.ign}\'s deaths to ${amount}`;
            save();
        }

        await interaction.followUp({
            content
        });
    }
}; 

export default SetDeaths;