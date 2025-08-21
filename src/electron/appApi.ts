import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export class applicationApi {
    constructor(protected window: BrowserWindow) {
    }
    public project = {
        onProjectOpen: (data: ProjectConfiguration) => {
            this.window.webContents.send('project-opened', data);
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
    }
    public application = {
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