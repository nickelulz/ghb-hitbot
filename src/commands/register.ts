import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { players, findPlayer, save, isRegisteredIGN } from "../database";
import Player from "../types/Player";

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
        const ign: string = String(options.get("ign")).trim();
        let content: string = "";

        if (!findPlayer(interaction.user.id)) {
            if (isRegisteredIGN(ign))
                content = "This IGN is already registered!";
            else if (ign != "null" && ign != null && ign != "") {
                players.push(new Player(interaction.user.id, ign));
                content = "You are now registered as " + ign;
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