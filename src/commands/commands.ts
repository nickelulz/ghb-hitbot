import { Command } from "../types/Command"
import { Hello } from './hello'
import { ListHits } from "./listhits"
import { PlaceHit } from "./placehit"
import { RemoveHit } from "./removehit"

const commands: Command[] = [ Hello, ListHits, PlaceHit, RemoveHit ]
export default commands