import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('applicationAPI', {

    saveProject: (data: ProjectConfiguration) => {
        ipcRenderer.send("saveProjectConfiguration", data);
    },

    onProjectOpen: (callback: (data: ProjectConfiguration) => void) => {
        ipcRenderer.on(OpenProjectChannel, (_event: any, data: ProjectConfiguration) => callback(data));
    }
});

export const OpenProjectChannel = "OpenProject";

export interface ProjectConfiguration {
    overview: string;
    scenes: SceneDefinition[];
}

export interface SceneDefinition {
    name: string;
    file: string;

    scenes: SceneDefinition[] | null;
}