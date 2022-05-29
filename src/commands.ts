import Command from "./types/Command"

// All Access Commands
import Hello from './commands/all-access/hello'
import Register from "./commands/all-access/register"
import Help from "./commands/all-access/help"
import ListRegisteredPlayers from "./commands/all-access/listregisteredplayers"
import Leaderboards from "./commands/all-access/leaderboards"
import ServerInfo from "./commands/all-access/serverinfo"
import Status from "./commands/all-access/status"
import ListOnlinePlayers from "./commands/all-access/listonlineplayers"
import ListBounties from "./commands/all-access/listbounties"

// Registered Only
import BountyCommand from "./commands/registeredonly/bountycommand"
import ContractCommand from "./commands/registeredonly/contractcommand"
import DeRegister from "./commands/registeredonly/deregister"
import CounterClaim from "./commands/registeredonly/counterclaim"

// Administrator only
import Start from "./commands/adminonly/start"
import EditPlayerData from "./commands/adminonly/editplayerdata"
import EvaluateClaim from "./commands/adminonly/evaluateclaim"

 // Root admin only
import Admin from "./commands/rootadminonly/admin"

// Command Registry
const commands: Command[] = [
    // Non-Registered User Commands
    // Hello, 
    // ListRegisteredPlayers, 
    // Register,
    // Help,
    // ServerInfo,
    // Status,
    // ListOnlinePlayers,
    // Leaderboards,
    // ListBounties,

    // Registered User Commands
    //BountyCommand,
    ContractCommand,
    // DeRegister,
    // CounterClaim,

    // Admin Only Commands
    // Start,
    // EditPlayerData,
    // EvaluateClaim,

    // Root Admin Only Commands
    // Admin
];

export default commands;