import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { players, findPlayerById, save, isRegisteredIGN } from "../database";
import Player from "../types/Player";
import logger from "../logger"

const Register: Command = {
    name: "register",
    description: "Register as a player (to link your discord to the server)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "Your In-Game Name",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const { options } = interaction;
        const ign: string = String(options.get("ign")?.value).trim();
        let content: string = "";

        if (!findPlayerById(interaction.user.id)) {
            if (isRegisteredIGN(ign))
                content = "This IGN is already registered!";
            else if (ign != "null" && ign != null && ign != "") {
                players.push(new Player(interaction.user.id, ign));
                content = "You are now registered as " + ign;
                logger.info("Registered new player " + ign + ".");
                save();
            }
            else
                content = "Invalid IGN!";
        }

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default Register;