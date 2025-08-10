import fs from 'fs';
import path from 'path';
// import yaml from 'js-yaml';


export default class ConfigurationManager {
    constructor(
        private targetDirectory: string
    ) {

    }

    public TryReadProjectConfiguration(): /*ProjectConfiguration |*/ null {
        try {
            // const mainConfig = path.join(this.targetDirectory, "adventure.yaml");
            // const fileContents = fs.readFileSync(mainConfig, 'utf8');
            // const data = yaml.load(fileContents) as ProjectConfiguration;
            
            // return data;r
            return null;
        } catch (e) {
            console.error('Error reading or parsing YAML:', e);
            return null;
        }
    }
}

