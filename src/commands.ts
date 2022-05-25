import Command from "./types/Command"

// All Access Commands
import Hello from './commands/all-access/hello'
import ListHits from "./commands/all-access/listhits"
import Register from "./commands/all-access/register"
import Help from "./commands/all-access/help"
import ListRegisteredPlayers from "./commands/all-access/listregisteredplayers"
import Leaderboards from "./commands/all-access/leaderboards"
import ServerInfo from "./commands/all-access/serverinfo"
import Status from "./commands/all-access/status"
import ListOnlinePlayers from "./commands/all-access/listonlineplayers"

// Registered Only
import SetBounty from "./commands/registeredonly/setbounty"
import SetContract from "./commands/registeredonly/setcontract"
import RemoveHit from "./commands/registeredonly/removehit"
import ClaimHit from "./commands/registeredonly/claimhit"
import DeRegister from "./commands/registeredonly/deregister"

// Administrator only
import Start from "./commands/adminonly/start"
import SetDeaths from "./commands/adminonly/setdeaths"
import SetKills from "./commands/adminonly/setkills"

 // Root admin only
import Admin from "./commands/rootadminonly/admin"
import DeAdmin from "./commands/rootadminonly/de-admin"

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
    SetBounty,
    SetContract,
    RemoveHit, 
    ClaimHit, 
    Leaderboards,

    // Admin Only Commands
    Admin,
    DeAdmin,
    Start,
    SetDeaths,
    SetKills,
    DeRegister
];

export default commands;