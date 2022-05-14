import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/types/Command";

export const ClaimHit: Command = {
    name: "claimhit",
    description: "De-list a hit on a selected person",
    type: "CHAT_INPUT",
    options: [
        {
            name: "hit-number",
            description: "The index of the hit (ex: 3)",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const { options } = interaction;
        const hitIndex = options.get("hit-number")?.value;
        const content = `Claimed hit ${hitIndex}`;

        await interaction.followUp({
            content
        });
    }
}; 