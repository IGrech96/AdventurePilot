export {}

declare global {
    interface Window {
        applicationApi: {
            project: {
                sendCreateNewCancelled: () => void;
                sendCreateNew: (name: string, path: string) => void;
                subscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                unsubscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                sendProjectItemClicked: (node: ProjectTreeItem) => void;
                subscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
                unsubscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
                invokeGetAvailableItems: () => Promise<(IDefinition)[]>;
            },
            file: {
                invokeSelectFolder: () => Promise<string | null>;
                subscribe_onDefaultProjectFolder: (callback: (event: any, path: string) => void) => void;
                unsubscribe_onDefaultProjectFolder: (callback: (event: any, path: string) => void) => void;
                sendOpenDefinition: (node: IDefinition) => void;
                subscribe_ondefinitionOpen: (callback: (event: any, content: any | null, node: IDefinition) => void) => void;
                unsubscribe_ondefinitionOpen: (callback: (event: any, content: any | null, node: IDefinition) => void) => void;
                sendSaveMarkdown: (content: string, node: IFileDefinition) => void;
                sendSaveCharacter: (content: any, node: IFileDefinition) => void;
                sendFileChanged: (node: IFileDefinition) => void;
                subscribe_onFileChanged: (callback: (event: any, node: IFileDefinition) => void) => void;
                unsubscribe_onFileChanged: (callback: (event: any, node: IFileDefinition) => void) => void;
                invokeGetFilePreview: (filePath: string) => Promise<string>;
                invokeSaveItemImage: (node: IDefinition, imageName: string, data: Uint8Array<ArrayBuffer>) => Promise<string>;
                invokeGetImageAsBase64: (path: string) => Promise<string>;
            },
            application: {
                sendSaveRequest: () => void;
                subscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
                unsubscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
            },
        },
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

}
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
