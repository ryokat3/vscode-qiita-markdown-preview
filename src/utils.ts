import { Icon } from "@fortawesome/fontawesome-svg-core"
import * as fs from "fs"
import * as path from "path"

export function toIconHtml(ico: Icon, className: string): string {
    return `<span class="${className}">${ico.html[0]}</span>`
}

export const isFileAccessible = (filePath:string, mode?:number):boolean => {
    try {
        fs.accessSync(filePath, mode)
        return true
    }
    catch (error) {
        return false
    }
}

export function makeDirectory (direcotry: string): void  {
    try {
        if (!fs.existsSync(direcotry)) {
            fs.mkdirSync(direcotry, { recursive: true})
        }
    }
    finally {
        return
    }
}

export function readJsonFile<T>(filePath: string): T {
    return isFileAccessible(filePath, fs.constants.R_OK) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : Object.create(null)
}

export function saveJsonFile<T>(filePath: string, data:T):void {
    makeDirectory(path.dirname(filePath))
    fs.writeFileSync(filePath, JSON.stringify(data))
}