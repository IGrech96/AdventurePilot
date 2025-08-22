export {}

declare global {
    interface Window {
        applicationApi: {
            project: {
                subscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                unsubscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                invokeProjectItemClicked: (node: ProjectTreeItem) => void;
                subscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
                unsubscribe_onProjectItemClicked: (callback: (event: any, node: ProjectTreeItem) => void) => void;
            },
            file: {
                invokeOpenMarkdown: (filePath: string, node: SceneDefinition | OverviewDefinition) => void;
                subscribe_onMarkdownOpen: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => void;
                unsubscribe_onMarkdownOpen: (callback: (event: any, content: string, node: SceneDefinition | OverviewDefinition) => void) => void;
                invokeSaveMarkdown: (content: string, node: SceneDefinition | OverviewDefinition) => void;
                invokeFileChanged: (node: SceneDefinition | OverviewDefinition) => void;
                subscribe_onFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => void;
                unsubscribe_onFileChanged: (callback: (event: any, node: SceneDefinition | OverviewDefinition) => void) => void;
            },
            application: {
                invokeSaveRequest: () => void;
                subscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
                unsubscribe_onSaveRequest: (callback: (event: any, ) => void) => void;
            },
        },
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
}