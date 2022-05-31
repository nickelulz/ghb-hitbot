import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { isContractor, players, findPlayerByIGN } from "../../database";
import Player from "../../types/Player";
import { COMMAND_ERROR_MESSAGES, NOT_FOUND_IMG_URL } from "../../constants";

function contractorStatus(player: Player): string {
    if (isContractor(player))
        return "🛑";
    else if (player.contractingCooldown > 0)
        return "⏳ " + player.contractingCooldownString;
    else
        return "🟢";
}

const Players: Command = {
    name: "players",
    description: "Lookup information about the registered players on this bot.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The ign of the player to lookup",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const ign = String(interaction.options.get("ign")?.value);
        if (ign === "undefined" || ign === undefined)
        {
            response.description = "";
            for (let i = 0; i < players.length; i++)
                response.description += (i+1) + ": " + players[i].ign + " " + contractorStatus(players[i]) + "\n";

            if (response.description === "")
                response.setDescription("❌ No players are currently registered on this discord bot.");
            else {
                response.setTitle("PLAYERS");
                response.description += '\n\`The emoji by the side of each name indicates their contractor status. 🛑 means they are currently a contractor, ⏳ means they are under cooldown, and 🟢 means they are ready to go!\`';
            }
        }
        else {
            const player = findPlayerByIGN(ign);
            if (!player)
                response.setDescription(COMMAND_ERROR_MESSAGES.PLAYER_NOT_FOUND);
            else {
                const player_discord = await client.users.fetch(player.discordId);

                if (player_discord === undefined)
                    response.setDescription
                else {
                    let userIcon = player_discord.avatarURL();
                    if (userIcon === null)
                        userIcon = NOT_FOUND_IMG_URL;

                    response
                    .setThumbnail(userIcon)
                    .setTitle('💡 PLAYER INFORMATION: ' + ign)
                    .setDescription(
                        '🎮 In-Game Name: ' + player.ign + '\n' +
                        '📓 Discord Name: ' + player_discord.tag + '\n' +
                        '🔪 Verified hit kills: ' + player.killCount + '\n' +
                        '🪦 Verified hit deaths: ' + player.deathCount + '\n' +
                        '⌛ Hit hiring cooldown: ' + player.hiringCooldownString + '\n' +
                        '⌛ Contracting cooldown: ' + player.contractingCooldownString + '\n' +
                        '⌛ Hit targetting cooldown: ' + player.targetingCooldownString
                    );
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
};

export default Players;