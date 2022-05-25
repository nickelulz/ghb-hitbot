import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../../types/Command";
import { players, findPlayerById, save, findPlayerByIGN, removeAllHits } from "../../database";
import logger from "../../logger"
import Contract from "../../types/Contract";

const DeRegister: Command = {
    name: "deregister",
    description: "De-Register a player (requires administrator access if it is not yourself)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The in-game name of the player to deregister",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = findPlayerById(interaction.user.id);
        const target = findPlayerByIGN(String(interaction.options.get("ign")?.value).trim());
        let content: string = "";

        if (!user)
            content = "❌ You are not a registered user!";
        else if (!target)
            content = "❌ The player you have marked to deregister is already not registered!";
        else {
            if (user.equals(target)) {
                players.splice(players.indexOf(user), 1);
                content = `✅ You have been successfully deregistered.`;
                logger.info(`User ${user.ign} deregistered themself.`);
                removeAllHits(target);
                save();
            }
            
            else {
                if (!user.isAdmin)
                    content = "❌ This command requires administrator access!";
                else {
                    players.splice(players.indexOf(target), 1);
                    content = `✅ Deregistered player ${target.ign}.`;
                    logger.info(`User ${user.ign} deregistered user ${target.ign}`);
                    removeAllHits(target);
                    save();
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default DeRegister;