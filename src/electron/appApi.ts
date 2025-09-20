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
        handleGetAvailableItems: (callback: (event: any, ) => (sourcetype)[]) => {
            ipcMain.handle('get-available-items', callback);
        },
    }
    public file = {
        receiveOpenDefinition: (callback: (event: any, node: sourcetype) => void) => {
            ipcMain.on('open-definition', callback);
        },
        ondefinitionOpen: (content: string | null, node: OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition) => {
            this.window.webContents.send('definition-opened', content, node);
        },
        receiveSaveMarkdown: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition | CommonDefinition) => void) => {
            ipcMain.on('save-markdown', callback);
        },
        receiveFileChanged: (callback: (event: any, node: sourcetype) => void) => {
            ipcMain.on('file-changed', callback);
        },
        onFileChanged: (node: sourcetype) => {
            this.window.webContents.send('file-changed', node);
        },
        handleGetFilePreview: (callback: (event: any, filePath: string) => string) => {
            ipcMain.handle('get-file-preview', callback);
        },
        handleSaveItemImage: (callback: (event: any, node: sourcetype, imageName: string, data: Uint8Array<ArrayBuffer>) => string) => {
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
    type: 'scene';
    name: string;
    file: string;
    scenes: SceneDefinition[];
}
export interface OverviewDefinition {
    type: 'overview';
    name: string;
    file: string;
}
export interface CommonDefinition {
    type: 'common';
    name: string;
    file: string;
}
export interface NpcDefinition {
    type: 'npc';
    name: string;
}
export interface ProjectTreeItem {
    children?: ProjectTreeItem[];
    type: nodetype;
    source?: sourcetype;
}
export type sourcetype = 
    OverviewDefinition |
    SceneDefinition |
    CommonDefinition |
    NpcDefinition;
export type nodetype = 
    'reserved' |
    'overview' |
    'locations-root' |
    'location' |
    'npces-root' |
    'npc' |
    'common';