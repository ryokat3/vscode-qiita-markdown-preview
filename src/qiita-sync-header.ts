import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import { RuleBlock } from "markdown-it/lib/parser_block"
import StateBlock = require("markdown-it/lib/rules_block/state_block")
import { RenderRule } from "markdown-it/lib/renderer"
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")
import { library, icon, Icon } from "@fortawesome/fontawesome-svg-core"
import { faTags } from "@fortawesome/free-solid-svg-icons"
import { toIconHtml } from "./utils"

const TAGS_ICON_FOREGROUND_COLOR = "#666666"

type RenderAssets = {
    tagsIcon: string
}

const headerRuler: RuleBlock = (state: StateBlock, startLine: number, endLine: number, silent: boolean):boolean => {
    if ((startLine > 0) || (!state.src.startsWith('<!--'))) {
        return false
    }
    if (silent) {
        return true
    }
    const lines: string[] = []
    for (let nextLine = startLine + 1; nextLine <= endLine; ++nextLine) {
        const start = state.bMarks[nextLine] + state.tShift[nextLine]
        const max = state.eMarks[nextLine]
        const line = state.src.slice(start, max)
        
        if (line.startsWith('-->')) {
            const token = state.push('qiita-sync-header', 'div', 0)            
            token.block = true
            token.map = [ startLine, nextLine ]            
            token.meta = lines

            state.line = nextLine + 1
            return true
        }
        else {
            lines.push(line)
        }
    }
    return false
}

function renderTitle(title: string|undefined): string {    
    return `<div class="qiita-header-title">${(title !== undefined) ? title : "No Title"}</div>`
}

function renderTag(tag:string): string {
    return `<a class="qiita-header-tag" href="https://qiita.com/tags/${tag}">${tag}</a>`
}

function renderTags(tags: string|undefined, tagsIcon: string): string  {    
    return `<div class="qiita-header-tags">
    <div class="qiita-header-tags-icon">${tagsIcon}</div>
    <div>${(tags !== undefined) ? tags.split(',').map(renderTag).join(",  ") : "No Tags"}</div>
    </div>`
}

const render:(assets: RenderAssets) => RenderRule = (assets: RenderAssets) => (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {    
    const lines: string[] = tokens[idx].meta    
    const header = new Map(lines.map((line: string)=>line.split(':', 2).map(((i)=>i.trim()))).filter((kv: string[]) => kv.length === 2).map((kv)=>[kv[0], kv[1]]))    

    return (header.has('title') || header.has('tags')) ? `<div class="qiita-header">${renderTitle(header.get('title'))}${renderTags(header.get('tags'), assets.tagsIcon)}</div>` : ""
}

export const markdownItQiitaSyncHeader :PluginSimple = (md: MarkdownIt): void => {
    library.add(faTags)

    console.log(`[Qiita-MD-Preview] markdownItQiitaSyncHeader activated`)

    md.block.ruler.before('fence', 'qiita-sync-header', headerRuler, {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
      })
    md.renderer.rules['qiita-sync-header'] = render({
        tagsIcon: toIconHtml(icon({ prefix: 'fas', iconName: 'tags'}), "qiita-header-tags-icon")
    });
}
