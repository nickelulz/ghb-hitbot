import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { findPlayerByIGN, findPlayerById, save } from "../database";
import { ADMIN_TOKEN } from "../constants"
import logger from "../logger";

const Admin: Command = {
    name: "admin",
    description: "Add new admin (requires *root admin* access)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The IGN of the user to be given admin permissions (must be registered)",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = "";
        const user = findPlayerById(interaction.user.id);
        const target = findPlayerByIGN(String(interaction.options.get("ign")?.value));

        // User not registered/not found
        if (!user)
            content = "❌ You are not a registered user! (make sure to use \`/register\` to register!)";

        // Target not registered/not found
        else if (!target)
            content = "❌ The user you selected to give admin to is not a registered user!";
        
        // User is not ROOT admin
        else if (!(user.isAdmin && user.discordId === ADMIN_TOKEN))
            content = "❌ You are not the **root** admin! (Only the bot configuration manager has root access!)";
        
        else if (target.isAdmin)
            content = "❌ Your target is already an admin";

        // Success
        else {
            target.isAdmin = true;
            logger.info(`User ${user.ign} gave administrator access to user ${target.ign}`);
            content = `✅ Successfully made user ${target.ign} an admin.`;
            save();
        }

        await interaction.followUp({
            content
        });
    }
}; 

export default Admin;