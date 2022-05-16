import Command from "../types/Command"
import Hello from './hello'
import ListHits from "./listhits"
import PlaceHit from "./placehit"
import RemoveHit from "./removehit"
import ClaimHit from "./claimhit"
import Register from "./register"
import ListPlayers from "./listplayers"
import Help from "./help"

// Registers all of the commands
const commands: Command[] = [ Hello, ListHits, PlaceHit, RemoveHit, ClaimHit, Register, ListPlayers, Help ];
export default commands;