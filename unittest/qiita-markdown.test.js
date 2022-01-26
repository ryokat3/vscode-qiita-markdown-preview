"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const qiita_note_1 = require("../src/qiita-note");
const qiita_sync_header_1 = require("../src/qiita-sync-header");
const sample1 = "sample/sample1.md";
const htmlDir = "html";
function saveHtml(filePath, html) {
    if (!fs.existsSync(htmlDir)) {
        fs.mkdirSync(htmlDir, { recursive: true });
    }
    fs.writeFileSync(`${path.join(htmlDir, path.basename(filePath))}.html`, `<html><head><title>${path.basename(filePath)}</title></head><body>${html}</body></html>`);
}
describe("markdown-it-qiita-note", () => {
    it("no plugin", () => {
        const mdit = MarkdownIt().use(qiita_note_1.markdownItQiitaNote).use(qiita_sync_header_1.markdownItQiitaSyncHeader);
        const html = mdit.render(fs.readFileSync(sample1).toString());
        saveHtml(sample1, html);
    });
});
//# sourceMappingURL=qiita-markdown.test.js.map