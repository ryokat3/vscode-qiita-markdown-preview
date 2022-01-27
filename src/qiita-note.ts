import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")
import MarkdownItContainer = require("markdown-it-container")
import { library, icon, Icon } from "@fortawesome/fontawesome-svg-core"
import { faTimesCircle, faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { toIconHtml } from "./utils"

type ContainerOpts = Parameters<typeof MarkdownItContainer>[2]
type ContainerValidateType = NonNullable<ContainerOpts['validate']>
type ContainerRenderType = NonNullable<ContainerOpts['render']>

const QIITA_NOTE_NAME = "qiita-note"

type IconAssets = {
    info: string,
    warn: string,
    alert: string
}

function props2html(icon: string, nodeType: string): string {    
    return `<div class="qiita-note-${nodeType}">
    <div class="qiita-note-body">
    <span style="width:3%;height:3%;margin-top:auto;margin-bottom:auto;margin-left:10px;margin-right:10px">${icon}</span>
    <span style="margin-top:auto;margin-bottom:auto">`
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
 
const render: (props: IconAssets) => ContainerRenderType = (props: IconAssets) => (tokens: Token[], index: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[index]

    if (token.nesting === 1) {
        const noteType = token.info.split(/\s+/)[1]
        switch (noteType) {
            case 'info': return props2html(props.info, noteType)                
            case 'warn': return props2html(props.warn, noteType)
            case 'alert': return props2html(props.alert, noteType)
            default: return '<div><div><span>'             
        }
    }
    else {
        return "</span></div></div>"
    }   
}

export const markdownItQiitaNote :PluginSimple = (md: MarkdownIt): void => {
    library.add(faCheckCircle, faExclamationCircle, faTimesCircle)

    MarkdownItContainer(md, QIITA_NOTE_NAME, {
        marker: ':',
        validate: validate,
        render: render({
            info: toIconHtml(icon({ prefix: 'fas', iconName: 'check-circle'}), "qiita-note-info-icon"),            
            warn: toIconHtml(icon({ prefix: 'fas', iconName: 'exclamation-circle'}), "qiita-note-warn-icon"),
            alert: toIconHtml(icon({ prefix: 'fas', iconName: 'times-circle'}), "qiita-note-alert-icon")            
        })
    })    
}
