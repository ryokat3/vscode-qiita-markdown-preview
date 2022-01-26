import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")
import MarkdownItContainer = require("markdown-it-container")
import { library, icon, Icon } from "@fortawesome/fontawesome-svg-core"
import { faTimesCircle, faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { icon2html } from "./utils"

type ContainerOpts = Parameters<typeof MarkdownItContainer>[2]
type ContainerValidateType = NonNullable<ContainerOpts['validate']>
type ContainerRenderType = NonNullable<ContainerOpts['render']>

const QIITA_NOTE_NAME = "qiita-note"
const QIITA_NOTE_OPEN_TYPE = `container_${QIITA_NOTE_NAME}_open`
const QIITA_NOTE_CLOSE_TYPE = `container_${QIITA_NOTE_NAME}_close`

const QIITA_NOTE_INFO_BACKGROUND = "#E5F8E2"
const QIITA_NOTE_INFO_ICON_FOREGROUND = "#55C500"
const QIITA_NOTE_WARN_BACKGROUND = "#FDF9E2"
const QIITA_NOTE_WARN_ICON_FOREGROUND = "#F7A535"
const QIITA_NOTE_ALERT_BACKGROUND = "#FBEFEE"
const QIITA_NOTE_ALERT_ICON_FOREGROUND = "#D60A34"

type NoteTypeAssets = {
    icon: string,
    backgroundColor: string
}

type RenderAssets = {
    info: NoteTypeAssets,
    warn: NoteTypeAssets,
    alert: NoteTypeAssets
}

function props2html(assets: NoteTypeAssets): string {
    return `<div style="display:flex;background-color:${assets.backgroundColor}">
    <div style="width:3%;height:3%;margin-top:auto;margin-bottom:auto;margin-left:10px;margin-right:10px">${assets.icon}</div>
    <div style="">`
}

const validate: ContainerValidateType = (params: string):boolean => {
    if (params.startsWith("note")) {
        const words = params.split(/\s+/)
        if ((words.length === 2) && ((words[1] === 'info') || (words[1] === 'warn') || (words[1] === 'alert'))) {
            return true
        }
    }
    return false
}
 
const render: (props: RenderAssets) => ContainerRenderType = (props: RenderAssets) => (tokens: Token[], index: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[index]

    if (token.nesting === 1) {
        const noteType = token.info.split(/\s+/)[1]
        switch (noteType) {
            case 'info': return props2html(props.info)                
            case 'warn': return props2html(props.warn)                
            case 'alert': return props2html(props.alert)
            default: return '<div><div>'             
        }
    }
    else {
        return "</div></div>"
    }   
}

export const markdownItQiitaNote :PluginSimple = (md: MarkdownIt): void => {
    library.add(faCheckCircle, faExclamationCircle, faTimesCircle)

    MarkdownItContainer(md, QIITA_NOTE_NAME, {
        marker: ':',
        validate: validate,
        render: render({
            info: {
                icon: icon2html(icon({ prefix: 'fas', iconName: 'check-circle'}), QIITA_NOTE_INFO_ICON_FOREGROUND),
                backgroundColor: QIITA_NOTE_INFO_BACKGROUND
            },
            warn: {
                icon: icon2html(icon({ prefix: 'fas', iconName: 'exclamation-circle'}), QIITA_NOTE_WARN_ICON_FOREGROUND),
                backgroundColor: QIITA_NOTE_WARN_BACKGROUND
            },
            alert: {
                icon: icon2html(icon({ prefix: 'fas', iconName: 'times-circle'}), QIITA_NOTE_ALERT_ICON_FOREGROUND),
                backgroundColor: QIITA_NOTE_ALERT_BACKGROUND
            }
        })
    })    
}
