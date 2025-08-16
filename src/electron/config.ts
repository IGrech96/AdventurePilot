import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const OpenProjectChannel = "OpenProject";

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

export default class ConfigurationManager {

    public TryReadProjectConfigurationFile(projectFile: string): ProjectConfiguration | null {
        try {
            const mainConfig = projectFile;
            const fileContents = fs.readFileSync(mainConfig, 'utf8');
            const data = yaml.load(fileContents) as ProjectConfiguration;
            if (!data.name){
                data.name = path.basename(path.dirname(projectFile));
            }
            return data;
        } catch (e) {
            console.error('Error reading or parsing YAML:', e);
            return null;
        }
    }

    public TryReadProjectConfigurationFolder(projectFolder: string): ProjectConfiguration | null {
        const mainConfig = path.join(projectFolder, "adventure.yaml");
        return this.TryReadProjectConfigurationFile(mainConfig);
    }
}

