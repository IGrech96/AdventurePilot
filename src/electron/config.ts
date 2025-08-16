import fs from 'fs';
import path from 'path';
import { ProjectConfiguration } from './appApi.js';
import yaml from 'js-yaml';


export default class ConfigurationManager {

    public TryReadProjectConfigurationFile(projectFile: string): ProjectConfiguration | null {
        try {
            const mainConfig = projectFile;
            const fileContents = fs.readFileSync(mainConfig, 'utf8');
            const data = yaml.load(fileContents) as ProjectConfiguration;
            
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

