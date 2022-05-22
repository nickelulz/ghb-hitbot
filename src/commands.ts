import Command from "./types/Command"
import Hello from './commands/hello'
import ListHits from "./commands/listhits"
import PlaceHit from "./commands/placehit"
import RemoveHit from "./commands/removehit"
import ClaimHit from "./commands/claimhit"
import Register from "./commands/register"
import ListRegisteredPlayers from "./commands/listregisteredplayers"
import Help from "./commands/help"
import Leaderboards from "./commands/leaderboards"
import Admin from "./commands/admin"
import DeAdmin from "./commands/de-admin"
import ServerInfo from "./commands/serverinfo"
import Status from "./commands/status"
import Start from "./commands/start"
import ListOnlinePlayers from "./commands/listonlineplayers"

// Command Registry
const commands: Command[] = [
    // Non-Registered User Commands
    Hello, 
    ListRegisteredPlayers, 
    ListHits, 
    Register,
    Help,
    ServerInfo,
    Status,
    ListOnlinePlayers,

    // Registered User Commands
    PlaceHit, 
    RemoveHit, 
    ClaimHit, 
    Leaderboards,

    // Admin Only Commands
    Admin,
    DeAdmin,
    Start
];

export default commands;