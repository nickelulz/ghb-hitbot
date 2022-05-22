import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../types/Command";
import { hits, findPlayerById } from "../database";
import Hit from "../types/Hit";

const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed();
        embed.description = "";
        const user = findPlayerById(interaction.user.id);

        for (let i = 0; i < hits.length; i++)
            embed.description += i + " ▸ " + hits[i].toString + "\n";

        if (embed.description.length == 0)
            embed.description = "❌ No hits are currently placed!";

        if (!user)
            embed.description += "\n\n\`💡 Make sure to register to place hits, remove hits, and claim hits...\`";
        else
            embed.setTitle("HITS");

        await interaction.followUp({
            ephemeral: true,
            embeds: [embed]
        });
    }
}; 

export default ListHits;