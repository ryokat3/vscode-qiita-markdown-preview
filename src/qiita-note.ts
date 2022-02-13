/****************************************************************

qiita-note.ts

# Qiita Syntax (3 variants)

:::note info
<message>
:::

:::note warn
<message>
:::

:::note alert
<message>
:::

The annotation of note notation can be omitted.
This case should be regarded as 'info'

Refer: https://github.com/ryokat3/vscode-qiita-markdown-preview/issues/1        

****************************************************************/

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
    return `<div class="qiita-note-${nodeType}"><div class="qiita-note-body">${icon}<span class="qiita-note-content">`
}

const validate: ContainerValidateType = (params: string):boolean => {
    if (params.startsWith("note")) {
        // Updated by issue#1 
        const words = params.trim().split(/\s+/)
        // false if word[0] is "notehoge" (issue #1)
        if ((words.length === 0) || (words[0].length !== 4)) {
            return false
        }
        if ((words.length === 1) || ((words.length === 2) && ((words[1] === 'info') || (words[1] === 'warn') || (words[1] === 'alert')))) {
            return true
        }
    }
    return false
}
 
const render: (props: IconAssets) => ContainerRenderType = (props: IconAssets) => (tokens: Token[], index: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[index]

    if (token.nesting === 1) {
        // Updated by issue#1 
        const keywords = token.info.trim().split(/\s+/)
        const noteType = (keywords.length === 2) ? keywords[1] : 'info'
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

    console.log(`[Qiita-MD-Preview] markdownItQiitaNote activated`)

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
