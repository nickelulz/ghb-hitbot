import { Command } from "../types/Command"
import { Hello } from './hello'
import { ListHits } from "./listhits"
import { PlaceHit } from "./placehit"
import { RemoveHit } from "./removehit"
import { ClaimHit } from "./claimhit"
import { Register } from "./register"

const commands: Command[] = [ Hello, ListHits, PlaceHit, RemoveHit, ClaimHit, Register ]
export default commands