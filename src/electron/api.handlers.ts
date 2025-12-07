import { applicationApi, ProjectTreeItem, IDefinition, IFileDefinition, asFileDefinition, SceneDefinition, CommonDefinition } from "./appApi.js";
import ConfigurationManager from "./config.js";
import { NewItemDialog } from "./dialogs/create-new-item.js";

export class ApiHandlers {

  constructor(
    private readonly api: applicationApi,
    private readonly configManager: ConfigurationManager
  ) {

  }

  public Subscribe(): () => void {

    const onhandleReceiveSaveMarkdown = (event: any, content: string, node: IFileDefinition) => {
      this.configManager.saveNodeContent(content, node);
    }

    const onhandleReceiveSaveCharacter = (event: any, content: any, node: IFileDefinition) => {
      this.configManager.saveNodeContent(content, node);
    }

    const onhandlerReceiveProjectItemClicked = (event: any, node: ProjectTreeItem) => {
      this.api.project.onProjectItemClicked(node);
    }

    const onhandleReceiveOpenNode = (event: any, node: IDefinition) => {
      let content;
      const fileDefinition = asFileDefinition(node);
      if (fileDefinition) {
        content = this.configManager.readNodeContent(fileDefinition);
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
      let content = this.configManager.readNodeContent({
        file: filePath,
        name: '-',
        type: "common",
      });

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

      const fileDefinition = asFileDefinition(node);
      if (fileDefinition) {
        return this.configManager.saveImage(fileDefinition, name, data);
      }
      return '';
    }

    const onhandlerGetImageAsBase64 = (event: any, filePath: string): string => {
      let content = this.configManager.readImage(filePath).toString('base64');
      if (!content) {
        content = ""
      }
      return content;
    }

    const onhandleGetAvailableItems = (event: any): (IDefinition)[] => {
      const config = this.configManager.Configuration
      const locations: SceneDefinition[] = [];
      const vist = (scenes: SceneDefinition[]) => {
        scenes.forEach(element => {
          locations.push(element);
          if (element.scenes) {
            vist(element.scenes);
          }
        });
      }

      vist(config.scenes ?? []);

      const result: (IDefinition)[] = [
        ...locations,
        ...config.npces ?? []
      ];

      if (config.common) {
        const commonContent = this.configManager.readNodeContent(config.common) as string;
        const getCommonDef = (x: string): CommonDefinition => {
          return { type: 'common', name: x, file: config.common.file };
        }
        const sections = commonContent
          .matchAll(/^#\s+([^\n]+)/gm)
          .map(x => x[1]);


        result.push(...sections.map(x => getCommonDef(x)))
      }
      return result;
    }

    const onHandleCreateScene = async (event: any, parent?: IDefinition): Promise<SceneDefinition | null> => {
      const dialog = new NewItemDialog()
      //TODO: check for duplicates
      const result = await dialog.showDialog();
      if (result) {
        return this.configManager.addNewScene(result.name, parent);
      }
      return null;
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
    this.api.project.subscribe_handleCreateScene(onHandleCreateScene);

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
      this.api.project.unsubscribe_handleCreateScene(onHandleCreateScene);

      this.api.application.unsubscribe_receiveSaveRequest(onhandleReceiveSaveRequest);
    }
  }
}
