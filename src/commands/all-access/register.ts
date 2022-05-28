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

        if (findPlayerById(interaction.user.id) !== false)
            response.setDescription("❌ You have already registered on this discord account!");
        else if (findPlayerByIGN(ign) !== false)
            response.setDescription("❌ This IGN is already registered!");
        else if (ign == "null" || ign == null || ign == "")
            response.setDescription("❌ Invalid IGN!");
        else {
            // Test if it can DM the user
            const user = await client.users.fetch(interaction.user.id)
            let canSendMessages: boolean = true;
            if (user === undefined)
                logger.error('New user ' + ign + ' is undefined. (@47-register.ts)');
            else {
                await user.send({ embeds: [ new MessageEmbed().setDescription("This is a test message to make sure I can send you direct messages!\nRock On! 😎") ] })
                .catch(() => {
                    response.setDescription("❌ The discord bot cannot DM you because of your settings. Make sure to turn it on in the server\'s privacy settings.\nhttps://imgur.com/a/W3A9TwH");
                    canSendMessages = false;
                })
                .finally(() => {
                    if (canSendMessages) {
                        players.push(new Player(interaction.user.id, ign));
                        response.setDescription("✅ You are now registered as " + ign);
                        logger.info("Registered new player " + ign + ".");
                        save();
                    }
                })
            }

            if (response.description == null) {
                logger.error('Error with response description. (@56-register.ts).');
                response.setDescription("Something went wrong. Uh Oh!");
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default Register;