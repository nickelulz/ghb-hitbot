import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";

const Help: Command = {
    name: "help",
    description: "Lists all of the commands that this bot has.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "command",
            description: "The specific command you want help with.",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const commandMode = String(interaction.options.get("command")?.value);
        if (commandMode === "undefined" || commandMode === undefined) {
            response
            .setTitle("COMMANDS")
            .setDescription(
    
                // All Access
                "▸ help\n" +
                "▸ hello\n" +
                "▸ leaderboards\n" +
                "▸ listbounties\n" +
                "▸ players\n" +
                "▸ register [ign: playername]\n" +
                "▸ playerstatus [ign: playername]\n" +
                "▸ serverinfo\n" +
                "▸ serverstatus\n" +
    
                // Registered Only
                "▸ *contract [mode: set/remove/claim/accept/deny] [?target: playername] [?contractor: playername] [?hirer: playername] [?price: value]*\n" +
                "▸ *bounty [mode: set/remove/claim] [?target: playername] [?hirer: playername] [?price: value]*\n" +
                "▸ *deregister*\n" +
                "▸ *counterclaim [mode: set/verify/reject/list] [?ign: playername]*\n" +
    
                // Admin Only
                "▸ **start**\n" +
                "▸ **editplayerdata [player: playername] [mode: kills/deaths] [newvalue: value]**\n" +
    
                // Root Admin
                "▸ \`admin [mode: give/remove] [user: playername]\`\n" +
    
                "\n\`(💡 all slanted commands require you to be registered)\`" +
                "\n\`(💡 all bolded commands require you to be an admin)\`" + 
                "\n\`(💡 all special commands require you to be the root admin)\`"
            );
        }
        else {
            switch (commandMode)
            {
                case "help": 
                {
                    response.setTitle("HELP") .setDescription("The command you\'re using right now! It will list either all of the commands, or list detailed information about each command.");
                    break;
                }

                default: 
                {
                    response.setDescription("Make sure to set the name of the command correctly. Remember, it is case sensitive.");
                    break;
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default Help;