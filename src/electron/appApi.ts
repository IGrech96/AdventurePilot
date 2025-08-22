import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export class applicationApi {
    constructor(protected window: BrowserWindow) {
    }
    public project = {
        onProjectOpen: (data: ProjectConfiguration) => {
            this.window.webContents.send('project-opened', data);
        },
        invokeProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => {
            ipcMain.on('item-clicked', callback);
        },
        onProjectItemClicked: (node: ProjectTreeItem) => {
            this.window.webContents.send('item-clicked', node);
        },
    }
    public file = {
        invokeOpenMarkdown: (callback: (event: any, filePath: string, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('open-markdown', callback);
        },
        onMarkdownOpen: (content: string, node: SceneDefinition | OverviewDefinition) => {
            this.window.webContents.send('markdown-opened', content, node);
        },
        invokeSaveMarkdown: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('save-markdown', callback);
        },
        invokeFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('file-changed', callback);
        },
        onFileChanged: (node: SceneDefinition | OverviewDefinition) => {
            this.window.webContents.send('file-changed', node);
        },
    }
    public application = {
        invokeSaveRequest: (callback: (event: any, ) => void) => {
            ipcMain.on('invoke-save', callback);
        },
        onSaveRequest: () => {
            this.window.webContents.send('save-requested', );
        },
    }
}
export interface ProjectConfiguration {
    overview: OverviewDefinition;
    scenes: SceneDefinition[];
}
export interface SceneDefinition {
    name: string;
    file: string;
    scenes: SceneDefinition[];
}
export interface OverviewDefinition {
    name: string;
    file: string;
}
export interface ProjectTreeItem {
    children?: ProjectTreeItem[];
    path?: string;
    type: "reserved" | "locations-root" | "location" | "overview";
    source?: OverviewDefinition | SceneDefinition;
}