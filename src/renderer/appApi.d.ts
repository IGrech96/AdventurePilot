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
                invokeGetAvailableItems: () => Promise<(OverviewDefinition | SceneDefinition | NpcDefinition | ArtifactDefinition)[]>;
            },
            file: {
                sendOpenMarkdown: (filePath: string, node: SceneDefinition | OverviewDefinition) => void;
                subscribe_onMarkdownOpen: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => void;
                unsubscribe_onMarkdownOpen: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => void;
                sendSaveMarkdown: (content: string, node: SceneDefinition | OverviewDefinition) => void;
                sendFileChanged: (node: SceneDefinition | OverviewDefinition) => void;
                subscribe_onFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => void;
                unsubscribe_onFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => void;
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
        artifacts: ArtifactDefinition[];
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
    export interface ArtifactDefinition {
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
        "ArtifactDefinition" |
        "NpcDefinition";
    export type nodetype =
        "reserved" |
        "overview" |
        "locations-root" |
        "location" |
        "npces-root" |
        "npc" |
        "artifacts-root" |
        "artifact";
}