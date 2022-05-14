import { Command } from "./command"
import { Hello } from './commands/hello'
import { ListHits } from "./commands/listhits"
import { PlaceHit } from "./commands/placehit"
import { RemoveHit } from "./commands/removehit"

const commands: Command[] = [ Hello, ListHits, PlaceHit, RemoveHit ]
export default commands