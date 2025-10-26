import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ProjectConfiguration, SceneDefinition } from './appApi.js';

export default class ConfigurationManager {
  private static readonly projectFile: string = "adventure.yaml";
  private static readonly commonFile: string = "common.yaml";
  private static readonly overviewFile: string = "overview.md";

  public TryReadProjectConfigurationFile(projectFile: string): ProjectConfiguration | null {
    try {
      const mainConfig = projectFile;
      const fileContents = fs.readFileSync(mainConfig, 'utf8');
      const data = yaml.load(fileContents) as ProjectConfiguration;

      const defaultName = path.basename(path.dirname(projectFile));
      if (!data.overview) {
        data.overview = {
          type: 'overview',
          file: "",
          name: defaultName
        };
      }
      if (!data.overview.name) {
        data.overview.name = defaultName;
      }

      data.common.type = 'common';
      data.common.name = 'common';
      data.overview.type = 'overview';

      data.npces.forEach(n => n.type = 'npc');
      const visitScens = (def: SceneDefinition) => {
        def.type = 'scene';
        def.scenes?.forEach(s => visitScens(s));
      }

      data.scenes.forEach(s => visitScens(s));

      return data;
    } catch (e) {
      console.error('Error reading or parsing YAML:', e);
      return null;
    }
  }

  public TryReadProjectConfigurationFolder(projectFolder: string): ProjectConfiguration | null {
    const mainConfig = path.join(projectFolder, ConfigurationManager.projectFile);
    return this.TryReadProjectConfigurationFile(mainConfig);
  }

  public CreateEmpty(name: string, projectFolder: string): ProjectConfiguration {
    const config: ProjectConfiguration = {
      overview: {
        name: name,
        type: 'overview',
        file: ConfigurationManager.overviewFile
      },
      scenes: [],
      common: {
        name: 'Common',
        type: 'common',
        file: ConfigurationManager.commonFile
      },
      npces: []
    };

    const data = yaml.dump(config);
    if (!fs.existsSync(projectFolder)){
      fs.mkdirSync(projectFolder);
    }
    fs.writeFileSync(path.join(projectFolder, ConfigurationManager.projectFile), data);

    return config;
  }
}

