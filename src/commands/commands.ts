import Command from "../types/Command"
import Hello from './hello'
import ListHits from "./listhits"
import PlaceHit from "./placehit"
import RemoveHit from "./removehit"
import ClaimHit from "./claimhit"
import Register from "./register"
import ListPlayers from "./listplayers"
import Help from "./help"
import Leaderboards from "./leaderboards"
import Admin from "./admin"
import DeAdmin from "./de-admin"

// Command Registry
const commands: Command[] = [
    // Non-Registered User Commands
    Hello, 
    ListPlayers, 
    ListHits, 
    Register,
    Help,

    // Registered User Commands
    PlaceHit, 
    RemoveHit, 
    ClaimHit, 
    Leaderboards,

    // Admin Only Commands
    Admin,
    DeAdmin
];

export default commands;