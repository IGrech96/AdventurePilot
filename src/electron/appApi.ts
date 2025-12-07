import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';

export class applicationApi {
    constructor(protected window: BrowserWindow) {
    }
    public project = {
        subscribe_receiveCreateNewCancelled: (callback: (event: any, ) => void) => {
            ipcMain.on('new-project-canceled', callback);
        },
        unsubscribe_receiveCreateNewCancelled: (callback: (event: any, ) => void) => {
            ipcMain.removeListener('new-project-canceled', callback);
        },
        subscribe_receiveCreateNew: (callback: (event: any, name: string, path: string) => void) => {
            ipcMain.on('new-project', callback);
        },
        unsubscribe_receiveCreateNew: (callback: (event: any, name: string, path: string) => void) => {
            ipcMain.removeListener('new-project', callback);
        },
        onProjectOpen: (data: ProjectConfiguration) => {
            this.window.webContents.send('project-opened', data);
        },
        subscribe_receiveProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => {
            ipcMain.on('item-clicked', callback);
        },
        unsubscribe_receiveProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => {
            ipcMain.removeListener('item-clicked', callback);
        },
        onProjectItemClicked: (node: ProjectTreeItem) => {
            this.window.webContents.send('item-clicked', node);
        },
        subscribe_handleGetAvailableItems: (callback: (event: any, ) => Promise<(IDefinition)[]> | (IDefinition)[]) => {
            ipcMain.handle('get-available-items', callback);
        },
        unsubscribe_handleGetAvailableItems: (callback: (event: any, ) => Promise<(IDefinition)[]> | (IDefinition)[]) => {
            ipcMain.removeListener('get-available-items', callback);
        },
        subscribe_handleCreateScene: (callback: (event: any, parent?: IDefinition) => Promise<SceneDefinition | null> | SceneDefinition | null) => {
            ipcMain.handle('create-new-scene', callback);
        },
        unsubscribe_handleCreateScene: (callback: (event: any, parent?: IDefinition) => Promise<SceneDefinition | null> | SceneDefinition | null) => {
            ipcMain.removeListener('create-new-scene', callback);
        },
    }
    public file = {
        subscribe_handleSelectFolder: (callback: (event: any, ) => Promise<string | null> | string | null) => {
            ipcMain.handle('select-folder', callback);
        },
        unsubscribe_handleSelectFolder: (callback: (event: any, ) => Promise<string | null> | string | null) => {
            ipcMain.removeListener('select-folder', callback);
        },
        onDefaultProjectFolder: (path: string) => {
            this.window.webContents.send('default-folder', path);
        },
        subscribe_receiveOpenDefinition: (callback: (event: any, node: IDefinition) => void) => {
            ipcMain.on('open-definition', callback);
        },
        unsubscribe_receiveOpenDefinition: (callback: (event: any, node: IDefinition) => void) => {
            ipcMain.removeListener('open-definition', callback);
        },
        ondefinitionOpen: (content: any | null, node: IDefinition) => {
            this.window.webContents.send('definition-opened', content, node);
        },
        subscribe_receiveSaveMarkdown: (callback: (event: any, content: string, node: IFileDefinition) => void) => {
            ipcMain.on('save-markdown', callback);
        },
        unsubscribe_receiveSaveMarkdown: (callback: (event: any, content: string, node: IFileDefinition) => void) => {
            ipcMain.removeListener('save-markdown', callback);
        },
        subscribe_receiveSaveCharacter: (callback: (event: any, content: any, node: IFileDefinition) => void) => {
            ipcMain.on('save-character', callback);
        },
        unsubscribe_receiveSaveCharacter: (callback: (event: any, content: any, node: IFileDefinition) => void) => {
            ipcMain.removeListener('save-character', callback);
        },
        subscribe_receiveFileChanged: (callback: (event: any, node: IFileDefinition) => void) => {
            ipcMain.on('file-changed', callback);
        },
        unsubscribe_receiveFileChanged: (callback: (event: any, node: IFileDefinition) => void) => {
            ipcMain.removeListener('file-changed', callback);
        },
        onFileChanged: (node: IFileDefinition) => {
            this.window.webContents.send('file-changed', node);
        },
        subscribe_handleGetFilePreview: (callback: (event: any, filePath: string) => Promise<string> | string) => {
            ipcMain.handle('get-file-preview', callback);
        },
        unsubscribe_handleGetFilePreview: (callback: (event: any, filePath: string) => Promise<string> | string) => {
            ipcMain.removeListener('get-file-preview', callback);
        },
        subscribe_handleSaveItemImage: (callback: (event: any, node: IDefinition, imageName: string, data: Uint8Array<ArrayBuffer>) => Promise<string> | string) => {
            ipcMain.handle('save-item-image', callback);
        },
        unsubscribe_handleSaveItemImage: (callback: (event: any, node: IDefinition, imageName: string, data: Uint8Array<ArrayBuffer>) => Promise<string> | string) => {
            ipcMain.removeListener('save-item-image', callback);
        },
        subscribe_handleGetImageAsBase64: (callback: (event: any, path: string) => Promise<string> | string) => {
            ipcMain.handle('get-image-as-base64', callback);
        },
        unsubscribe_handleGetImageAsBase64: (callback: (event: any, path: string) => Promise<string> | string) => {
            ipcMain.removeListener('get-image-as-base64', callback);
        },
    }
    public application = {
        subscribe_receiveSaveRequest: (callback: (event: any, ) => void) => {
            ipcMain.on('invoke-save', callback);
        },
        unsubscribe_receiveSaveRequest: (callback: (event: any, ) => void) => {
            ipcMain.removeListener('invoke-save', callback);
        },
        onSaveRequest: () => {
            this.window.webContents.send('save-requested', );
        },
    }
}

export interface IDefinition {
  name: string
  type: DefinitionType
}

export interface IFileDefinition extends IDefinition {
  file: string
}

export type DefinitionType = 'overview' | 'scene' | 'common' | 'npc'

export interface ProjectConfiguration {
  overview: OverviewDefinition;
  scenes: SceneDefinition[];
  common: CommonDefinition;
  npces: NpcDefinition[];
}
export interface SceneDefinition extends IDefinition, IFileDefinition {
  scenes: SceneDefinition[];
}
export interface OverviewDefinition extends IDefinition, IFileDefinition {
}
export interface CommonDefinition extends IDefinition, IFileDefinition {
}
export interface NpcDefinition extends IDefinition, IFileDefinition {
  engine: string
  attributes: any
}
export interface ProjectTreeItem {
  children?: ProjectTreeItem[];
  type: nodetype;
  source?: IDefinition;
}

export type nodetype =
  'reserved' |
  'scenes-root' |
  'npces-root' |
  DefinitionType;

export function asFileDefinition(object: unknown) : IFileDefinition | undefined {
  const reference: IFileDefinition = {
    file: '',
    name: '',
    type: 'common'
  };

  if (hasShape<IFileDefinition>(object, reference)){
    return object as IFileDefinition
  }

  return undefined;
}

function hasShape<T extends object>(obj: unknown, shape: T): obj is T {
  if (typeof obj !== 'object' || obj === null) return false;

  const shapeKeys = Object.keys(shape);
  return shapeKeys.every((key) => key in obj);
}
