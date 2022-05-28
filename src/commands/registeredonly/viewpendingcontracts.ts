import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { hits, findPlayerById } from '../../database';
import Contract from '../../types/Contract';

const ViewPendingContracts: Command = {
    name: "viewpendingcontracts",
    description: "View a list of all of your pending contracts.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("");
        const user = findPlayerById(interaction.user.id);
        
        if (!user)
            response.setDescription("❌ You are not a registered user! Use \`/register\` to register!");
        else {
            let count = 0;
            for (let i = 0; i < hits.length; i++)
                if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(user) && (<Contract> hits[i]).pending) {
                    response.description += (i+1) + " " + hits[i].toString + "\n";
                    count++;
                }
            response.description = `👌 You have ${count} pending contracts!\n` + response.description;
        }

        if (response.description == "")
            response.description = "🥸 You have no pending contracts!";

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ViewPendingContracts;