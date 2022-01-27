import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import { RenderRule } from "markdown-it/lib/renderer"
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")

const CODE_BACKGROUND = "#364549"
const CODE_INFO_BACKGROUND = "#777777"

const render:(originalRule: RenderRule) => RenderRule = (originalRule: RenderRule) => (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {    
    const token = tokens[idx]
    if ((token.tag === "code") && token.block && (token.info.indexOf(':') > -1)) {        
        const lang = token.info.slice(0,token.info.indexOf(':'))
        const info = token.info.slice(token.info.indexOf(':') + 1)
        token.info = lang
        const code = originalRule(tokens, idx, options, env, self)
                
        return `<div class="qiita-code"><div><span class="qiita-code-title">${info}</span></div><div class="qiita-code-block">${code}</div></div>`        
    }
    else {
        return originalRule(tokens, idx, options, env, self)
    }
}

export const markdownItQiitaCode :PluginSimple = (md: MarkdownIt): void => {

    const originalRule = md.renderer.rules['fence']
    if (originalRule !== undefined) {        
        md.renderer.rules['fence'] = render(originalRule)    
    }
}