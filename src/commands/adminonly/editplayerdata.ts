import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { findPlayerById, findPlayerByIGN, save } from "../../database";
import Command from "../../types/Command";

const EditPlayerData: Command = {
    name: "editplayerdata",
    description: "Edit either the kills or the deaths of a user. Requires administrator permissions.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The IGN of the user to be changed",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "mode",
            description: "kills/deaths",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "newvalue",
            description: "The new amount to set the user\'s hit kills/deaths to.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = findPlayerById(interaction.user.id);
        const target = findPlayerByIGN(String(interaction.options.get("ign")?.value));
        const amount = Number(interaction.options.get("amount")?.value);
        const mode = String(interaction.options.get("mode")?.value);
        const response = new MessageEmbed();
        
        // User not registered/not found
        if (!user)
            response.setDescription("❌ You are not a registered user! (make sure to use \`/register\` to register!)");

        // Target not registered/not found
        else if (!target)
            response.setDescription("❌ The user you selected to change is not registered!");
        
        // User is not an admin
        else if (!user.isAdmin)
            response.setDescription("❌ You are not an administrator!");

        // Successful
        else {
            switch (mode) 
            {
                case "kills": 
                {
                    target.killCount = amount;
                    response.setDescription(`✅ Set user ${target.ign}\'s kills to ${amount}`);
                    break;
                }

                case "deaths":
                {
                    target.deathCount = amount;
                    response.setDescription(`✅ Set user ${target.ign}\'s deaths to ${amount}`);
                    break;
                }

                default: 
                {
                    response.setDescription('Your mode has to be either \'kills\' or \'deaths\'.');
                    break;
                }
            }

            save();
        }

        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default EditPlayerData;