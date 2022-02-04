import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import Token = require("markdown-it/lib/token")

export const markdownItQiitaStyle :PluginSimple = (md: MarkdownIt): void => {
    console.log(`[Qiita-MD-Preview] markdownItQiitaStyle activated`)

    const render = md.renderer.render
    md.renderer.render = (tokens: Token[], options: MarkdownIt.Options, env: any) =>
            `<div class="qiita-style">${render.apply(md.renderer, [tokens, options, env])}</div>`    
}