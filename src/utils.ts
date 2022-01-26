
import { Icon } from "@fortawesome/fontawesome-svg-core"

export function icon2html(ico: Icon, foreground: string): string {
    // TODO: Do we have formal way to update ?
    return ico.html[0].replace('fill="currentColor"', `fill="${foreground}"`)
}