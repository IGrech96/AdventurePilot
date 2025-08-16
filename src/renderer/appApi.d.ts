export {}

declare global {
    interface Window {
        applicationAPI: {
            saveProject: (data: ProjectConfiguration) => void;
            onProjectOpen: (callback: (data: ProjectConfiguration) => void) => void;
        };
    }
    export interface ProjectConfiguration {
        name?: string;
        overview: string;
        scenes: SceneDefinition[];
    }

    export interface SceneDefinition {
        name: string;
        file: string;

        scenes: SceneDefinition[] | null;
    }
}