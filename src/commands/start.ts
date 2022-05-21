import { BaseCommandInteraction, Client } from "discord.js";
import { findPlayerById } from "../database";
import {  } from "../constants"
import Command from "../types/Command";

const Start: Command = {
    name: "start",
    description: "Starts the server. Requires admin access.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = "";
        const user = findPlayerById(interaction.user.id);

        // User not registered/not found
        if (!user)
            content = "❌ You are not a registered user! (make sure to use \`/register\` to register!)";
        
        // User is not an admin
        else if (!user.isAdmin)
            content = "❌ You are not an admin!";

        // Attempt to start the server  
        else {
            
        }

        await interaction.followUp({
            content
        });
    }
}; 

export default Start;