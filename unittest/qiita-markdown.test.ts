import * as fs from "fs"
import * as path from "path"
import MarkdownIt = require("markdown-it")
import { markdownItQiitaNote } from "../src/qiita-note"
import { markdownItQiitaSyncHeader } from "../src/qiita-sync-header"

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
        const mdit = MarkdownIt().use(markdownItQiitaNote).use(markdownItQiitaSyncHeader)
        const html = mdit.render(fs.readFileSync(sample1).toString())
        saveHtml(sample1, html)
    })
})