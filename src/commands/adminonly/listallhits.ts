import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { hits, findPlayerById } from "../../database";
import Bounty from '../../types/Bounty';
import Contract from "../../types/Contract";

const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits, both bounties AND contracts (public and private)",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        response.description = "";
        const user = findPlayerById(interaction.user.id);

        if (!user)
            response.setDescription("❌ You are not a registered player!");
        else if (!user.isAdmin)
            response.setDescription("❌ You are not an administrator!");
        else {
            let count = 1;
            for (let i = 0; i < hits.length; i++)
                if (hits[i] instanceof Bounty || hits[i] instanceof Contract && (<Contract> hits[i]).pending)
                    response.description += count++ + " -> " + hits[i].toString + "\n";
    
            if (response.description.length == 0)
                response.description = "❌ No hits are currently placed!";
            if (!user)
                response.description += "\n\n\`💡 Make sure to register to place hits, remove hits, and claim hits...\`";
            else 
                response.setTitle("HITS");
        }

        if (response.description == "")
            response.setDescription("❌ Error in getting the list of hits. Try again later? :)");

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ListHits;