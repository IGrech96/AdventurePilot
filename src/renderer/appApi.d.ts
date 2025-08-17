export {}

declare global {
    interface Window {
        applicationApi: {
            project: {
                subscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
                unsubscribe_onProjectOpen: (callback: (event: any, data: ProjectConfiguration) => void) => void;
            },
            file: {
                invokeOpenMarkdown: (filePath: string, node: SceneDefinition | OverviewDefinition) => void;
                subscribe_onMarkdownOpen: (callback: (event: any, content: string) => void) => void;
                unsubscribe_onMarkdownOpen: (callback: (event: any, content: string) => void) => void;
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
}