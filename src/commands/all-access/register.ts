import DiscordJS, { BaseCommandInteraction, ButtonInteraction, Client, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { players, findPlayerById, save, findPlayerByIGN } from "../../database";
import { Server } from '../../constants';
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

        if (findPlayerById(interaction.user.id) !== false) {
            response.setDescription("❌ You have already registered on this discord account!");
            await interaction.followUp({ ephemeral: true, embeds: [ response ] });
        }
        else if (findPlayerByIGN(ign) !== false) {
            response.setDescription("❌ This IGN is already registered!");
            await interaction.followUp({ ephemeral: true, embeds: [ response ] });
        }
        else if (ign == "null" || ign == null || ign == "") {
            response.setDescription("❌ Invalid IGN!");
            await interaction.followUp({ ephemeral: true, embeds: [ response ] });
        }
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
                    interaction.followUp({ ephemeral: true, embeds: [ response ] });
                    canSendMessages = false;
                })
                .finally(() => {
                    if (canSendMessages) {
                        interaction.followUp({
                            ephemeral: true,
                            embeds: [ new MessageEmbed().setDescription(Server.Rules) ], 
                            components: [ new MessageActionRow().addComponents(
                                new MessageButton()
                                .setCustomId('rules_agree')
                                .setEmoji('🤝')
                                .setLabel('Agree to The Rules and Register')
                                .setStyle('SUCCESS')                        
                            )]
                        });

                        const filter = (press: any) => press.user.id === interaction.user.id;
                        let pressed: boolean = false;
                        interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 1000 * 15 })
                        .on('end', (collection) => {
                            if (collection.first()?.customId === 'rules_agree') {
                                players.push(new Player(interaction.user.id, ign));
                                response.setDescription("✅ You are now registered as " + ign);
                                logger.info("Registered new player " + ign + ".");
                                pressed = true;
                                save();
                            }
                            
                            if (!pressed)
                                response.setDescription('❌ You have to agree to the rules to register.');

                            interaction.editReply({ embeds: [ response ], components: [] });
                        });
                    }
                })
            }
        }
    }
}; 

export default Register;