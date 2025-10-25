import { applicationApi, ProjectConfiguration, ProjectTreeItem, IDefinition, IFileDefinition, asFileDefinition, SceneDefinition, CommonDefinition } from "./appApi.js";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class ApiHandlers implements Disposable {
  constructor(
    private api: applicationApi,
    private projectFolder: string,
    private config: ProjectConfiguration
  ) {

  }
  [Symbol.dispose](): void {
    this.Unsubscribe();
  }

  public Unsubscribe(): void {

  }

  public Subscribe() {
    this.api.file.receiveOpenDefinition(this.handleReceiveOpenNode);

    this.api.file.receiveSaveMarkdown(this.handleReceiveSaveMarkdown);

    this.api.file.receiveSaveCharacter(this.handleReceiveSaveCharacter);

    this.api.project.receiveProjectItemClicked(this.handlerReceiveProjectItemClicked);

    this.api.file.receiveFileChanged(this.handleReceiveFiledChanged);

    this.api.application.receiveSaveRequest(this.handleReceiveSaveRequest);

    this.api.project.handleGetAvailableItems(this.handleGetAvailableItems);

    this.api.file.handleGetFilePreview(this.handleGetFilePreview)

    this.api.file.handleSaveItemImage(this.handleSaveImage)

    this.api.file.handleGetImageAsBase64(this.handlerGetImageAsBase64)
  }

  private handleReceiveSaveMarkdown(event: any, content: string, node: IFileDefinition) {
    fs.writeFileSync(path.join(this.projectFolder, node.file), content, {
      encoding: 'utf-8'
    });
  }

  private handleReceiveSaveCharacter(event: any, content: any, node: IFileDefinition) {
    const data = yaml.dump(content);
    fs.writeFileSync(path.join(this.projectFolder, node.file), data, {
      encoding: 'utf-8'
    });
  }

  private handlerReceiveProjectItemClicked(event: any, node: ProjectTreeItem) {
    this.api.project.onProjectItemClicked(node);
  }

  private handleReceiveOpenNode(event: any, node: IDefinition) {
    let content;
    const fileDefinition = asFileDefinition(node);
    if (fileDefinition) {
      content = fs.readFileSync(path.join(this.projectFolder, fileDefinition.file), 'utf8');
    }
    if (!content) {
      content = ""
    }
    if (fileDefinition?.type == "npc") {
      content = yaml.load(content)
    }
    this.api.file.ondefinitionOpen(content, node);
  }

  private handleReceiveFiledChanged(event: any, node: IFileDefinition) {
    this.api.file.onFileChanged(node);
  }

  private handleReceiveSaveRequest(event: any) {
    this.api.application.onSaveRequest();
  }

  private handleGetFilePreview(event: any, filePath: string): string {
    let content = fs.readFileSync(path.join(this.projectFolder, filePath), 'utf8');
    if (!content) {
      content = ""
    }
    return content;
  }

  private handleSaveImage(
    event: any,
    node: IDefinition,
    name: string,
    data: Uint8Array<ArrayBuffer>): string {

    const rootFolder = "images";
    const fileDefinition = asFileDefinition(node);

    const subfolder = fileDefinition ? path.basename(fileDefinition.file, path.extname(fileDefinition.file)) : node.type

    const fullDirPath = path.join(this.projectFolder, rootFolder, subfolder);
    const fullFilePath = path.join(fullDirPath, name);

    if (!fs.existsSync(fullDirPath)) {
      fs.mkdirSync(fullDirPath, { recursive: true });
    }
    fs.writeFileSync(fullFilePath, data, { flush: true });
    return path.join('/', rootFolder, subfolder, name).replace(/\\/g, '/');
  }

  private handlerGetImageAsBase64(event: any, filePath: string): string {
    let content = fs.readFileSync(path.join(this.projectFolder, filePath)).toString('base64');
    if (!content) {
      content = ""
    }
    return content;
  }

  private handleGetAvailableItems(event: any): (IDefinition)[] {
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

    const result: (IDefinition)[] = [
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



