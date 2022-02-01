import { PluginSimple } from "markdown-it"
import MarkdownIt = require("markdown-it")
import { RuleBlock } from "markdown-it/lib/parser_block"
import StateBlock = require("markdown-it/lib/rules_block/state_block")
import { RenderRule } from "markdown-it/lib/renderer"
import Renderer = require("markdown-it/lib/renderer")
import Token = require("markdown-it/lib/token")
import { URL } from "url"
import { OpenGraphProperties, OpenGraphImage, SuccessResult, ErrorResult } from "open-graph-scraper"
import vscode = require("vscode")
import scraper = require("open-graph-scraper")


function getLine(state: StateBlock, lineNo: number): string {
    return state.src.slice(state.bMarks[lineNo], state.eMarks[lineNo])
}

const linkCardRuler: RuleBlock = (state: StateBlock, startLine: number, endLine: number, silent: boolean):boolean => {
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false
    }
    if ((startLine !== 0) && (getLine(state, startLine - 1).trim() !== "")) {
        return false
    }
    if ((startLine !== endLine) && (getLine(state, startLine + 1).trim() !== "")) {
        return false
    }
    const line = getLine(state, startLine).trim()
    try {        
        const url = new URL(line)        
        if ((url.protocol !== 'http:') && (url.protocol !== 'https:')) {
            return false
        }
        if (silent) {
            return true
        }
        state.line = startLine + 1

        const token = state.push('qiita-link-card', 'qiita-link-card', 0);
        token.map = [ startLine, state.line ]
        token.meta = url

        return true
    }
    catch (e:unknown) {        
        return false
    }
}

type OgpData = {
    readonly status: "succeeded"
    readonly title: string
    readonly imageUrl: string
}

type OgpStatus = OgpData | {
    readonly status: "failed"
} | {
    readonly status: Promise<any>
}

type LinkCardCache = {
    [key:string]:OgpStatus
}

function ogImageToUrl(image: (OpenGraphImage | OpenGraphImage[])): string {    
    const ogImage:OpenGraphImage =  (Array.isArray(image)) ? image[0] : image
    return ogImage.url
}

function successResultToData(success: SuccessResult): OgpStatus {
    return (success.result.ogType !== undefined) && (success.result.ogTitle !== undefined) &&
    (success.result.ogUrl !== undefined) && (success.result.ogImage !== undefined) ?
    {        
        status: "succeeded",
        imageUrl: ogImageToUrl(success.result.ogImage),
        title: success.result.ogTitle 
    } : {
        status: "failed"
    }
}

function refreshPreview(cache: LinkCardCache) {
    for (const url in cache) {
        const status = cache[url].status
        if ((status === "succeeded") || (status === "failed")) {
            continue
        }
        else {
            return
        }
    }
    vscode.commands.executeCommand('markdown.preview.refresh')
}

export async function spawnLinkCard(url: string, cache: LinkCardCache): Promise<void> {    
    scraper({ url: url}).then((result:SuccessResult|ErrorResult) => {
        if (! result.error) {
            cache[url] = successResultToData(result)
        }
        else {
            cache[url] = { status: "failed" }
        }
        vscode.commands.executeCommand('markdown.preview.refresh')
        refreshPreview(cache)
    }, (reason: any) => {
        cache[url] = { status: "failed"}
        refreshPreview(cache)
    })
}

function getLinkCardHtml(url: URL, data: OgpData): string {
    return `<div><a class="qiita-link-card" href="${url}">
        <div style="padding: 16px;">
            <div class="qiita-link-card-title">${data.title}</div>
            <span class="qiita-link-card-site">${url.protocol}//${url.hostname}</span>
        </div>
        <img class="qiita-link-card-image" src="${data.imageUrl}"></img></a></div>`
}

const linkCardRender:(cache: LinkCardCache) => RenderRule = (cache: LinkCardCache) =>(tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
    const url: string = (tokens[idx].meta as URL).toString()
    const data = cache[url]
    if (data === undefined) {
        cache[url] = { status: spawnLinkCard(url, cache) }
        return `<p>${url}</p>`
    }
    else if (data.status === "succeeded") {
        const imgHtml = getLinkCardHtml(tokens[idx].meta as URL, data)
        console.log(imgHtml)
        return imgHtml
    }    
    else {       
        return `<p>${url}</p>`
    }
}

export const markdownItQiitaLinkCard :PluginSimple = (md: MarkdownIt): void => {    
    const cache: LinkCardCache = Object.create(null)

    md.block.ruler.before('paragraph', 'qiita-link-card', linkCardRuler)
    md.renderer.rules['qiita-link-card'] = linkCardRender(cache)
}