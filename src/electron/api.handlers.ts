import { applicationApi, CommonDefinition, NpcDefinition, OverviewDefinition, ProjectConfiguration, ProjectTreeItem, SceneDefinition, sourcetype } from "./appApi.js";
import fs from 'fs';
import path from 'path';

export class ApiHandlers {
  constructor(
    private projectFolder: string,
    private config: ProjectConfiguration
  ) {

  }
  public Subscribe(api: applicationApi) {
    api.file.receiveOpenDefinition((event: any, node: SceneDefinition | OverviewDefinition | CommonDefinition | NpcDefinition) => {
      let content;
      if ("file" in node) {
        content = fs.readFileSync(path.join(this.projectFolder, node.file), 'utf8');
      }
      if (!content) {
        content = ""
      }
      api.file.ondefinitionOpen(content, node);
    });

    api.file.receiveSaveMarkdown((event: any, content: string, node: SceneDefinition | OverviewDefinition | CommonDefinition) => {
      fs.writeFileSync(path.join(this.projectFolder, node.file), content, {
        encoding: 'utf-8'
      });
    });

    api.project.receiveProjectItemClicked((event: any, node: ProjectTreeItem) => {
      api.project.onProjectItemClicked(node);
    });

    api.file.receiveFileChanged((event: any, node: sourcetype) => {
      api.file.onFileChanged(node);
    });

    api.application.receiveSaveRequest((event: any) => {
      api.application.onSaveRequest();
    });

    api.project.handleGetAvailableItems((event: any) => this.handleGetAvailableItems(event));

    api.file.handleGetFilePreview((event: any, filePath: string) => {
      let content = fs.readFileSync(path.join(this.projectFolder, filePath), 'utf8');
      if (!content) {
        content = ""
      }
      return content;
    })

    api.file.handleSaveItemImage((
      event: any,
      node: sourcetype,
      name: string,
      data: Uint8Array<ArrayBuffer>) => {

      const rootFolder = "images";
      const subfolder = 'file' in node ? path.basename(node.file, path.extname(node.file)) : node.type

      const fullDirPath = path.join(this.projectFolder, rootFolder, subfolder);
      const fullFilePath = path.join(fullDirPath, name);

      if (!fs.existsSync(fullDirPath)) {
        fs.mkdirSync(fullDirPath, { recursive: true });
      }
      fs.writeFileSync(fullFilePath, data, { flush: true });
      return path.join('/', rootFolder, subfolder, name).replace(/\\/g, '/');
    })

    api.file.handleGetImageAsBase64((event: any, filePath: string) => {
      let content = fs.readFileSync(path.join(this.projectFolder, filePath)).toString('base64');
      if (!content) {
        content = ""
      }
      return content;
    })
  }

  private handleGetAvailableItems(event: any): (OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition)[] {
    const locations: SceneDefinition[] = [];
    const vist = (scenes: SceneDefinition[]) => {
      scenes.forEach(element => {
        locations.push(element);
        if (element.scenes) {
          vist(element.scenes);
        }
      });
    }

    vist(this.config?.scenes ?? []);

    const result: (OverviewDefinition | SceneDefinition | NpcDefinition | CommonDefinition)[] = [
      ...locations,
      ...this.config?.npces ?? []
    ];

    if (this.config.common && this.config.common.file) {
      const commonContent = fs.readFileSync(path.join(this.projectFolder, this.config.common.file), 'utf8');
      const getCommonDef = (x: string): CommonDefinition => {
        return { type: 'common', name: x, file: this.config.common.file };
      }
      const sections = commonContent
        .matchAll(/^#\s+([^\n]+)/gm)
        .map(x => x[1]);


      result.push(...sections.map(x => getCommonDef(x)))
    }
    return result;
  }
}



