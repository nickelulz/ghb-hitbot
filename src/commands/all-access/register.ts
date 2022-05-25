import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { players, findPlayerById, save, findPlayerByIGN } from "../../database";
import Player from "../../types/Player";
import logger from "../../logger"

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
        const response = new MessageEmbed();

        if (!findPlayerById(interaction.user.id)) {
            if (!findPlayerByIGN(ign))
                if (ign != "null" && ign != null && ign != "") {
                    players.push(new Player(interaction.user.id, ign));
                    response.description = "✅ You are now registered as " + ign;
                    logger.info("Registered new player " + ign + ".");
                    save();
                }   
                else
                    response.description = "❌ Invalid IGN!";
            else
                response.description = "❌ This IGN is already registered!";
        }
        else
            response.description = "❌ You have already registered on this discord account!";

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default Register;