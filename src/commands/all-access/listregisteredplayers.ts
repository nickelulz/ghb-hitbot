import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { isContractor, players } from "../../database";
import Player from "../../types/Player";

const ListRegisteredPlayers: Command = {
    name: "listregisteredplayers",
    description: "Lists all currently registered players",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        response.description = "";

        for (let i = 0; i < players.length; i++)
            response.description += (i+1) + ": " + players[i].ign + " " + contractorStatus(players[i]) + "\n";

        if (response.description === "")
            response.description = "❌ No players are currently registered on this discord bot.";
        else
            response.setTitle("PLAYERS");

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

function contractorStatus(player: Player): string {
    if (isContractor(player))
        return "🛑";
    else if (player.contractingCooldown > 0)
        return "⏳ " + player.contractingCooldownString;
    else
        return "🟢";
}

export default ListRegisteredPlayers;