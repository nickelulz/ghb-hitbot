import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { MINIMUM_HIT_PRICE } from "../../constants";
import Command from "../../types/Command";

const Help: Command = {
    name: "help",
    description: "Acts as the documentation for this bot.",
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
        if (commandMode === "undefined" || commandMode === undefined) 
        {
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
                "▸ status\n\n" +
    
                // Registered Only
                "▸ *contract [mode: set/remove/claim/accept/deny] [?target: playername] [?contractor: playername] [?hirer: playername] [?price: value]*\n" +
                "▸ *bounty [mode: set/remove/claim] [?target: playername] [?hirer: playername] [?price: value]*\n" +
                "▸ *deregister*\n" +
                "▸ *counterclaim [mode: set/verify/reject/list] [?ign: playername]*\n\n" +
                "▸ *changeign [newign: playername]*\n\n" +
    
                // Admin Only
                "▸ **start**\n" +
                "▸ **editplayerdata [player: playername] [mode: kills/deaths] [newvalue: value]**\n\n" +
    
                // Root Admin
                "▸ \`admin [mode: give/remove] [user: playername]\`\n" +
    
                "\n\`(💡 all slanted commands require you to be registered)\`" +
                "\n\`(💡 all bolded commands require you to be an admin)\`" + 
                "\n\`(💡 all special commands require you to be the root admin)\`"
            );
        }
        else 
        {
            switch (commandMode)
            {
                case "help": 
                    response.setTitle("HELP") .setDescription("The command you\'re using right now! It will list either all of the commands, or list detailed information about each command.");
                    break;

                case "hello":
                    response.setTitle("HELLO").setDescription("Returns a cool greeting.");
                    break;

                case "leaderboards": 
                    response.setTitle("LEADERBOARDS").setDescription("List out the rankings of players by the most verified kills by hit and most verified deaths by hit.");
                    break;

                case "players":
                    response.setTitle("PLAYERS").setDescription("This command is used for getting information about the *registered* players on this bot. Without specifying a \`player\`, it will simply return a list of players on this bot with indications on their cooldown statuses for contracting hits, placing hits, and being targetted, but by using \`/players player:[ign]\` it will return detailed information about the selected player in particular.\n\n\`Usage: /players [optional player:playername]\`");

                case "register":
                    response.setTitle("REGISTER").setDescription("It registers you with this discord bot. It links your minecraft in-game name to your discord id. Requires you to not currently be registered to use.\n\n\`Usage: /register ign:[Your in-game name]\`");

                case "serverinfo":
                    response.setTitle("SERVERINFO").setDescription("Displays all of the preset server information, such as the IP address and PORT or DNS, the server version, and the server rules (which can be checked out using \`/rules\` as well.");
                    break;

                case "status":
                    response.setTitle("STATUS").setDescription("Fetches and displays the status of the server using the API \`api.mcsrvstat.us\`. It will list whether the server is up, and if it is, it will list the amount of players currently online.");
                    break;

                case "contract":
                    response.setTitle("CONTRACT").setDescription(
                        "This command is used for handling everything having to do with *contracts*. There are **5** distinct modes to this command: \`set\`, \`remove\`, \`claim\`, \`accept\`, and \`deny\`\n\n" +
                        "▸ \`set\`: Used for setting new contracts. Usage: \`/contract mode:set target:[Target\'s IGN] contractor:[The IGN of your preferred Contractor] price:[The hit price. **Must be higher than " + MINIMUM_HIT_PRICE + "**]\`\n" +
                        "▸ \`remove\`: Used for removing contracts **that you placed yourself.** Usage: \`/contract mode:remove contractor:[The IGN of the contractor you used for this contract]\`\n" +
                        "▸ \`claim\`: Used for claiming contracts **where you are the contractor.** (If you intend to claim a contract where you were the target, use \`/counterclaim\` instead.) Usage: \`/contract mode:claim hirer:[The IGN of the hirer of this contract]\`\n" +
                        "▸ \`accept\`: Used for accepting pending contracts where hirers have asked you to be the contractor. Usage: \`/contract mode:accept hirer:[The IGN of the hirer of this contract]\`\n" +
                        "▸ \`deny\`: Used for denying pending contracts where hirers have asked you to be the contractor. Usage: \`/contract mode:accept hirer:[The IGN of the hirer of this contract]\`\n\n" +
                        "*This command requires you to be registered.*");
                    break;

                case "bounty":
                    response.setTitle("BOUNTY").setDescription(
                        "This command is used for handling everything having to do with *bounties*. There are **3** distinct modes to this command: \`set\`, \`remove\`, \`claim\`, and \`list\`\n\n" +
                        "▸ \`set\`: Used for setting new contracts. Requires you to  Usage: \`/bounty mode:set target:[The IGN of the target of this bounty] price:[The hit price. **Must be higher than " + MINIMUM_HIT_PRICE + "**]\`\n" +
                        "▸ \`remove\`: Used for removing bounties **that you placed yourself.** Usage: \`/bounty mode:remove target:[The IGN of the target of this bounty]\`\n" +
                        "▸ \`claim\`: Used for claiming bounties. (If you intend to claim a bounty where you were the target, use \`/counterclaim\` instead.) Usage: \`/bounty mode:claim target:[The IGN of the target of this bounty] hirer:[The IGN of the hirer of this contract]\`\n" +
                        "▸ \`list\`: Lists out all of the available, open bounties for anybody to pursue and claim. Usage: \`/bounty mode:list\`\n\n" +
                        "*This command requires you to be registered.* (The only exception is \`mode:list\`, where anyone can use that.");
                    break;

                case "counterclaim":
                    response.setTitle("COUNTERCLAIM").setDescription("This command is used for placing a counterclaim against a hit actively placed on you, in the event that you kill your attacker. **This command requires you to be the target of an active hit, and to be a registered user.**");
                    break;

                case "start":
                    response.setTitle("START").setDescription("This command starts the server (if it is not already online.) **Requires administrator permissions.**");
                    break;

                case "editplayerdata":
                    response.setTitle("EDITPLAYERDATA").setDescription("This command is for editing player data (either their kills or deaths). It has **2** distinct modes: \`deaths\` and \`kills\`. Usage: \`/editplayerdata player:[The player to set the kills/deaths of] mode:[deaths/kills] newvalue:[The new value to set their kills/deaths to]\`\n\n**This command requires administrator permissions.**");
                    break;

                case "evaluateclaim":
                    response.setTitle("EVALUATECLAIM").setDescription("This command is for evaluating claims set by players. This command has **3** main modes: \`verify\`, \`reject\`, \`list\`.\n\n" +
                    "▸ \`verify\`: Used to verify/accept a claim. Usage: \`/evaluateclaim mode:verify ign:[The IGN of the player who placed the claim]\`\n" +
                    "▸ \`reject\`: Used to reject/deny a claim. Usage: \`/evaluateclaim mode:reject ign:[The IGN of the player who placed the claim]\`" +
                    "▸ \`list\`: Lists out all of the pending claims. Usage: \`/evaluateclaim mode:list\`\n\n" +
                    "**This command requires administrator permissions**");
                    break;

                case "admin":
                    response.setTitle("ADMIN").setDescription("Used to give/remove admin. **Requires you to be the root administrator.** Usage: \`/admin mode:[give/remove] ign:[The IGN of the user to give/remove administrator access]\`");
                    break;

                default: 
                    response.setDescription("Make sure to set the name of the command correctly. Remember, it is case sensitive.");
                    break;
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default Help;