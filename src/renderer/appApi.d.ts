export {}

declare global {
    interface Window {
        applicationApi: {
            project: {
                subscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                unsubscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                sendProjectItemClicked: (node: ProjectTreeItem) => void;
                subscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
                unsubscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
                invokeGetAvailableItems: () => Promise<(sourcetype)[]>;
            },
            file: {
                sendOpenDefinition: (node: sourcetype) => void;
                subscribe_ondefinitionOpen: (callback: (event: any, content: string | null, node: OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition) => void) => void;
                unsubscribe_ondefinitionOpen: (callback: (event: any, content: string | null, node: OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition) => void) => void;
                sendSaveMarkdown: (content: string, node: SceneDefinition | OverviewDefinition | CommonDefinition) => void;
                sendFileChanged: (node: sourcetype) => void;
                subscribe_onFileChanged: (callback: (event: any, node: sourcetype) => void) => void;
                unsubscribe_onFileChanged: (callback: (event: any, node: sourcetype) => void) => void;
                invokeGetFilePreview: (filePath: string) => Promise<string>;
                invokeSaveItemImage: (node: sourcetype, imageName: string, data: Uint8Array<ArrayBuffer>) => Promise<string>;
                invokeGetImageAsBase64: (path: string) => Promise<string>;
            },
            application: {
                sendSaveRequest: () => void;
                subscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
                unsubscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
            },
        },
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
}