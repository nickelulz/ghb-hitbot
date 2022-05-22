import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../types/Command";
import { players } from "../database";
import Player from "../types/Player"

const Leaderboards: Command = {
    name: "leaderboards",
    description: "Lists out the leaderboards for kills and deaths (descending)",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let embed = new MessageEmbed();
        if (players.length == 0)
            embed.setDescription("❌ No players are currently registered!");
        else {
            let deathRankings: Player[] = players;
            let killRankings: Player[] = players;

            sort(deathRankings, 1);
            sort(killRankings, 0);

            embed.description = "**KILLS (from hits):**\n";
            for (let i = 0; i < killRankings.length; i++)
                embed.description += `${i+1}: ${killRankings[i].ign} - ${killRankings[i].killCount}\n`;

            embed.description += "\n**DEATHS (from hits):**\n";
            for (let i = 0; i < deathRankings.length; i++)
                embed.description += `${i+1}: ${deathRankings[i].ign} - ${deathRankings[i].deathCount}\n`;
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed]
        });
    }
}; 

/**
 * @param mode
 *  1: deathCount
 *  0: killCount
 * 
 *  selection sort
 */
function sort(arr: Player[], mode: number) {
    for (let i = 0; i < arr.length-1; i++) {
        let min = i;
        for (let j = i+1; j < arr.length; j++)
            if (mode == 1 ? arr[j].deathCount < arr[i].deathCount : arr[j].killCount > arr[i].killCount)
                min = j;
        let temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
    }
}

export default Leaderboards;