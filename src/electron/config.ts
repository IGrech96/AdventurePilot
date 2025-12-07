import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { IDefinition, ProjectConfiguration, SceneDefinition } from './appApi.js';

export default class ConfigurationManager {

  private static readonly projectFile: string = "adventure.yaml";
  private static readonly commonFile: string = "common.yaml";
  private static readonly overviewFile: string = "overview.md";

  private static readonly scenesDir: string = "scenes";
  private static readonly imagesDir: string = "images";

  private readonly projectFolder: string;

  private constructor(
    private readonly projectFile: string,
    private readonly configuration: ProjectConfiguration) {
    this.projectFolder = path.dirname(this.projectFile);
  }

  public get Configuration(): ProjectConfiguration {
    return this.configuration
  }

  private static normilizeFileName(name: string): string {
    // 1) Remove invalid filename characters (Windows, macOS, Linux safe set)
    // Invalid: \ / : * ? " < > |
    const invalidChars = /[\\/:*?"<>|]/g;
    let normalized = name.replace(invalidChars, "");

    // 2) Replace spaces with underscores
    normalized = normalized.replace(/\s+/g, "_");

    // 3) Convert to lowercase
    normalized = normalized.toLowerCase();

    return normalized;
  }

  private ensureSystemFolders() {
    const sceneFolder = path.join(this.projectFolder, ConfigurationManager.scenesDir);
    if (!fs.existsSync(sceneFolder)) {
      fs.mkdirSync(sceneFolder);
    }
    const imageFolder = path.join(this.projectFolder, ConfigurationManager.imagesDir);
    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder);
    }
  }

  public save() {
    const data = yaml.dump(this.configuration);
    if (!fs.existsSync(this.projectFolder)) {
      fs.mkdirSync(this.projectFolder);
    }
    fs.writeFileSync(this.projectFile, data);

    this.ensureSystemFolders();
  }

  public addNewScene(name: string, parent?: IDefinition) : SceneDefinition {

    let foundParent: SceneDefinition | undefined;
    const visitScens = (def: SceneDefinition) => {
      if (parent && parent.name == def.name && parent.type == def.type) {
        foundParent = def;
        return;
      }
      def.scenes?.forEach(s => visitScens(s));
    }

    this.configuration.scenes.forEach(s => visitScens(s));

    const newItem: SceneDefinition = {
      scenes: [],
      name: name,
      type: 'scene',
      file: path.join(ConfigurationManager.scenesDir, ConfigurationManager.normilizeFileName(name + '.md'))
    }

    if (foundParent) {
      foundParent.scenes.push(newItem);
    }
    else {
      this.configuration.scenes.push(newItem);
    }

    this.save();
    fs.writeFileSync(path.join(this.projectFolder, newItem.file), `# ${name}`)

    return newItem;
  }

  public static tryReadProjectConfigurationFile(projectFile: string): ConfigurationManager | null {
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

      data.scenes?.forEach(s => visitScens(s));

      return new ConfigurationManager(projectFile, data);
    } catch (e) {
      console.error('Error reading or parsing YAML:', e);
      return null;
    }
  }

  public static tryReadProjectConfigurationFolder(projectFolder: string): ConfigurationManager | null {
    const mainConfig = path.join(projectFolder, ConfigurationManager.projectFile);
    return ConfigurationManager.tryReadProjectConfigurationFile(mainConfig);
  }

  public static createEmpty(name: string, projectFolder: string): ConfigurationManager {
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

    const projectPath = path.join(projectFolder, ConfigurationManager.projectFile);
    const manager = new ConfigurationManager(projectPath, config);
    manager.save();
    return manager;
  }
}

