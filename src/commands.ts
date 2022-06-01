import Command from "./types/Command"

// All Access Commands
import Hello from './commands/all-access/hello'
import Register from "./commands/all-access/register"
import Help from "./commands/all-access/help"
import Leaderboards from "./commands/all-access/leaderboards"
import ListOnlinePlayers from "./commands/all-access/listonlineplayers"
import Players from "./commands/all-access/players"
import ServerCommand from "./commands/all-access/servercommand"

// Registered Only
import BountyCommand from "./commands/registeredonly/bountycommand"
import ContractCommand from "./commands/registeredonly/contractcommand"
import CounterClaim from "./commands/registeredonly/counterclaim"
import ChangeIGN from "./commands/registeredonly/changeign"

// Administrator only
import EditPlayerData from "./commands/adminonly/editplayerdata"
import EvaluateClaim from "./commands/adminonly/evaluateclaim"

 // Root admin only
import Admin from "./commands/rootadminonly/admin"

// Command Registry
const commands: Command[] = [
    // Non-Registered User Commands
    Hello, 
    Register,
    Help,
    ServerCommand,
    ListOnlinePlayers,
    Leaderboards,
    Players,

    // Registered User Commands
    BountyCommand,
    ContractCommand,
    CounterClaim,
    ChangeIGN,

    // Admin Only Commands
    EditPlayerData,
    EvaluateClaim,

    // Root Admin Only Commands
    Admin
];

export default commands;