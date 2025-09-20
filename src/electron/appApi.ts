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
        handleGetAvailableItems: (callback: (event: any, ) => (IDefinition)[]) => {
            ipcMain.handle('get-available-items', callback);
        },
    }
    public file = {
        receiveOpenDefinition: (callback: (event: any, node: IDefinition) => void) => {
            ipcMain.on('open-definition', callback);
        },
        ondefinitionOpen: (content: string | null, node: IDefinition) => {
            this.window.webContents.send('definition-opened', content, node);
        },
        receiveSaveMarkdown: (callback: (event: any, content: string, node: IFileDefinition) => void) => {
            ipcMain.on('save-markdown', callback);
        },
        receiveFileChanged: (callback: (event: any, node: IFileDefinition) => void) => {
            ipcMain.on('file-changed', callback);
        },
        onFileChanged: (node: IFileDefinition) => {
            this.window.webContents.send('file-changed', node);
        },
        handleGetFilePreview: (callback: (event: any, filePath: string) => string) => {
            ipcMain.handle('get-file-preview', callback);
        },
        handleSaveItemImage: (callback: (event: any, node: IDefinition, imageName: string, data: Uint8Array<ArrayBuffer>) => string) => {
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

export interface IDefinition {
  name: string
  type: DefinitionType
}

export interface IFileDefinition {
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
    file: ''
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
