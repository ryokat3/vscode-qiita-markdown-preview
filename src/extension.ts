// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { ExtensionContext } from "vscode"
import MarkdownIt = require("markdown-it")
import { markdownItQiitaNote } from "./qiita-note"
import { markdownItQiitaSyncHeader } from "./qiita-sync-header"
import { markdownItQiitaCode } from "./qiita-code"
import { markdownItQiitaStyle } from "./qiita-style"
import { markdownItQiitaLinkCard } from "./qiita-link-card"

const CONFIG_SECTION = 'qiita-markdown-preview'
const STATUS_KEY = 'status'

export function activate(context: ExtensionContext) {
	console.log(`[qiita-markdown-preview] activated`)
	
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration(CONFIG_SECTION)) {
			vscode.window.showInformationMessage("Reload window to change \"Qiita Markdown Preview\" configuration", "Reload")
			.then((selectedAction: "Reload"|undefined)=> {
				if (selectedAction === "Reload") {
					vscode.commands.executeCommand('workbench.action.reloadWindow')
				}
			})            
        }
    }))
		
	return (vscode.workspace.getConfiguration(CONFIG_SECTION).get<string>(STATUS_KEY) !== "disable") ? {
		extendMarkdownIt(md: MarkdownIt) {			
			return md.use(markdownItQiitaStyle)
				.use(markdownItQiitaNote)
				.use(markdownItQiitaSyncHeader)
				.use(markdownItQiitaCode)
				.use(markdownItQiitaLinkCard)
		}
	} : {
		extendMarkdownIt(md: MarkdownIt) {			
			return md
		}		
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
