import { applicationApi, ProjectConfiguration, ProjectTreeItem, IDefinition, IFileDefinition, asFileDefinition, SceneDefinition, CommonDefinition } from "./appApi.js";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export class ApiHandlers {

  constructor(
    private api: applicationApi,
    private projectFolder: string,
    private config: ProjectConfiguration
  ) {

  }

  public Subscribe(): () => void {

    const onhandleReceiveSaveMarkdown = (event: any, content: string, node: IFileDefinition) => {
      fs.writeFileSync(path.join(this.projectFolder, node.file), content, {
        encoding: 'utf-8'
      });
    }

    const onhandleReceiveSaveCharacter = (event: any, content: any, node: IFileDefinition) => {
      const data = yaml.dump(content);
      fs.writeFileSync(path.join(this.projectFolder, node.file), data, {
        encoding: 'utf-8'
      });
    }

    const onhandlerReceiveProjectItemClicked = (event: any, node: ProjectTreeItem) => {
      this.api.project.onProjectItemClicked(node);
    }

    const onhandleReceiveOpenNode = (event: any, node: IDefinition) => {
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

    const onhandleReceiveFiledChanged = (event: any, node: IFileDefinition) => {
      this.api.file.onFileChanged(node);
    }

    const onhandleReceiveSaveRequest = (event: any) => {
      this.api.application.onSaveRequest();
    }

    const onhandleGetFilePreview = (event: any, filePath: string): string => {
      let content = fs.readFileSync(path.join(this.projectFolder, filePath), 'utf8');
      if (!content) {
        content = ""
      }
      return content;
    }

    const onhandleSaveImage = (
      event: any,
      node: IDefinition,
      name: string,
      data: Uint8Array<ArrayBuffer>): string => {

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

    const onhandlerGetImageAsBase64 = (event: any, filePath: string): string => {
      let content = fs.readFileSync(path.join(this.projectFolder, filePath)).toString('base64');
      if (!content) {
        content = ""
      }
      return content;
    }

    const onhandleGetAvailableItems = (event: any): (IDefinition)[] => {
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

    this.api.file.subscribe_receiveOpenDefinition(onhandleReceiveOpenNode);
    this.api.file.subscribe_receiveSaveMarkdown(onhandleReceiveSaveMarkdown);
    this.api.file.subscribe_receiveSaveCharacter(onhandleReceiveSaveCharacter);
    this.api.file.subscribe_receiveFileChanged(onhandleReceiveFiledChanged);
    this.api.file.subscribe_handleGetFilePreview(onhandleGetFilePreview)
    this.api.file.subscribe_handleSaveItemImage(onhandleSaveImage)
    this.api.file.subscribe_handleGetImageAsBase64(onhandlerGetImageAsBase64)

    this.api.project.subscribe_receiveProjectItemClicked(onhandlerReceiveProjectItemClicked);
    this.api.project.subscribe_handleGetAvailableItems(onhandleGetAvailableItems);

    this.api.application.subscribe_receiveSaveRequest(onhandleReceiveSaveRequest);

    return () => {
      this.api.file.unsubscribe_receiveOpenDefinition(onhandleReceiveOpenNode);
      this.api.file.unsubscribe_receiveSaveMarkdown(onhandleReceiveSaveMarkdown);
      this.api.file.unsubscribe_receiveSaveCharacter(onhandleReceiveSaveCharacter);
      this.api.file.unsubscribe_receiveFileChanged(onhandleReceiveFiledChanged);
      this.api.file.unsubscribe_handleGetFilePreview(onhandleGetFilePreview)
      this.api.file.unsubscribe_handleSaveItemImage(onhandleSaveImage)
      this.api.file.unsubscribe_handleGetImageAsBase64(onhandlerGetImageAsBase64)

      this.api.project.unsubscribe_receiveProjectItemClicked(onhandlerReceiveProjectItemClicked);
      this.api.project.unsubscribe_handleGetAvailableItems(onhandleGetAvailableItems);

      this.api.application.unsubscribe_receiveSaveRequest(onhandleReceiveSaveRequest);
    }
  }


}



