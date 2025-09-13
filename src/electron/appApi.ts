import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export class applicationApi {
    constructor(protected window: BrowserWindow) {
    }
    public project = {
        onProjectOpen: (data: ProjectConfiguration) => {
            this.window.webContents.send('project-opened', data);
        },
        receiveProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => {
            ipcMain.on('item-clicked', callback);
        },
        onProjectItemClicked: (node: ProjectTreeItem) => {
            this.window.webContents.send('item-clicked', node);
        },
        handleGetAvailableItems: (callback: (event: any, ) => (OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition)[]) => {
            ipcMain.handle('get-available-items', callback);
        },
    }
    public file = {
        receiveOpenMarkdown: (callback: (event: any, filePath: string, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('open-markdown', callback);
        },
        onMarkdownOpen: (content: string, node: SceneDefinition | OverviewDefinition) => {
            this.window.webContents.send('markdown-opened', content, node);
        },
        receiveSaveMarkdown: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('save-markdown', callback);
        },
        receiveFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => {
            ipcMain.on('file-changed', callback);
        },
        onFileChanged: (node: SceneDefinition | OverviewDefinition) => {
            this.window.webContents.send('file-changed', node);
        },
        handleGetFilePreview: (callback: (event: any, filePath: string) => string) => {
            ipcMain.handle('get-file-preview', callback);
        },
        handleSaveItemImage: (callback: (event: any, node: SceneDefinition | OverviewDefinition, imageName: string, data: Uint8Array<ArrayBuffer>) => string) => {
            ipcMain.handle('save-item-image', callback);
        },
        handleGetImageAsBase64: (callback: (event: any, path: string) => string) => {
            ipcMain.handle('get-image-as-base64', callback);
        },
    }
    public application = {
        receiveSaveRequest: (callback: (event: any, ) => void) => {
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
    common: CommonDefinition;
    npces: NpcDefinition[];
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
export interface CommonDefinition {
    name: string;
    file: string;
}
export interface NpcDefinition {
    name: string;
    file: string;
}
export interface ProjectTreeItem {
    children?: ProjectTreeItem[];
    path?: string;
    type: nodetype;
    source?: OverviewDefinition | SceneDefinition;
}
export type sourcetype = 
    "OverviewDefinition" |
    "SceneDefinition" |
    "CommonDefinition" |
    "NpcDefinition";
export type nodetype = 
    "reserved" |
    "overview" |
    "locations-root" |
    "location" |
    "npces-root" |
    "npc" |
    "common";