import { BaseCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

/**
 * The root interface for all commands.
 * 
 * @interface Command
 * @extends ChatInputApplicationCommandData
 */
export default interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: BaseCommandInteraction) => void;
} 