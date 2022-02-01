import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import MarkdownIt = require("markdown-it")
import { markdownItQiitaNote } from "../src/qiita-note"
import { markdownItQiitaSyncHeader } from "../src/qiita-sync-header"
import { markdownItQiitaCode } from "../src/qiita-code"
import { spawnLinkCard } from "../src/qiita-link-card"
import { activate } from "../src/extension"

const sample1 = "sample/sample1.md"
const htmlDir = "html"

function saveHtml(filePath: string, html: string): void {    
    if (!fs.existsSync(htmlDir)) {
        fs.mkdirSync(htmlDir, { recursive: true })
    }
    fs.writeFileSync(`${path.join(htmlDir, path.basename(filePath))}.html`, `<html><head><title>${path.basename(filePath)}</title></head><body>${html}</body></html>`)    
}

describe("markdown-it-qiita-note", () => {
    it("no plugin", ()=> {        
        const mdit = activate({} as any).extendMarkdownIt(MarkdownIt())
        const html = mdit.render(fs.readFileSync(sample1).toString())
        saveHtml(sample1, html)
    })

    it("spawnLinkCard", async () => {        
        await spawnLinkCard("https://qiita.com/Qiita/items/c686397e4a0f4f11683d", Object.create(null))
        await spawnLinkCard("https://github.com/ryokat3/vscode-qiita-markdown-preview", Object.create(null))
        await spawnLinkCard("https://youtu.be/jQUebw8uac0", Object.create(null))
    })
})