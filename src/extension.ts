// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import MarkdownIt = require("markdown-it")
import { markdownItQiitaNote } from "./qiita-note"
import { markdownItQiitaSyncHeader } from "./qiita-sync-header"
import { markdownItQiitaCode } from "./qiita-code"
import { markdownItQiitaStyle } from "./qiita-style"
import { markdownItQiitaLinkCard } from "./qiita-link-card"

const configSection = 'qiita-markdown-preview';
const enableKey = 'enable';

export function activate(context: vscode.ExtensionContext) {
	console.log(`[Qiita-MD-Preview] activated`)
	
	return vscode.workspace.getConfiguration(configSection, null).get(enableKey) ? {
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
