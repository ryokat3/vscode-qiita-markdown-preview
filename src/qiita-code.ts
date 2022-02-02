import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import { RenderRule } from "markdown-it/lib/renderer"
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")
import katex = require("katex")

const render:(originalRule: RenderRule) => RenderRule = (originalRule: RenderRule) => (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {    
    const token = tokens[idx]    
    if ((token.tag === "code") && token.block && (token.info.trim().toLowerCase() === "math")) {        
        return `<div class="qiita-math-block">${katex.renderToString(token.content, { displayMode: true, throwOnError: false})}</div>`
    }
    else if ((token.tag === "code") && token.block && (token.info.indexOf(':') > -1)) {        
        const lang = token.info.slice(0,token.info.indexOf(':'))
        const info = token.info.slice(token.info.indexOf(':') + 1)
        token.info = lang
        const code = originalRule(tokens, idx, options, env, self)        
        return `<div class="qiita-code"><div><span class="qiita-code-title">${info}</span></div><div class="qiita-code-block">${code}</div></div>`        
    }
    else {
        return `<div class="qiita-code"><div class="qiita-code-block">${originalRule(tokens, idx, options, env, self)}</div></div>`
    }
}

export const markdownItQiitaCode :PluginSimple = (md: MarkdownIt): void => {

    const originalRule = md.renderer.rules['fence']
    if (originalRule !== undefined) {        
        md.renderer.rules['fence'] = render(originalRule)    
    }
}