import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import ConfigurationManager from './config.js';
import { applicationApi, ArtifactDefinition, NpcDefinition, OverviewDefinition, ProjectTreeItem, SceneDefinition, sourcetype } from './appApi.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class Main {
  private mainWindow: BrowserWindow | null = null;
  constructor(
    private application: Electron.App,
    private browserWindow: typeof Electron.BrowserWindow
  ) {
    application.on('window-all-closed', this.onWindowAllClosed.bind(this));
    application.on('ready', this.onReady.bind(this));
  }

  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  }

  // private onClose =() => {
  //     // Dereference the window object.
  //     // this.mainWindow = null;
  // }

  private onReady() {
    this.mainWindow = new BrowserWindow(
      {
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, './appApi.preload.js'),
          contextIsolation: true
        }
      });
    // this.mainWindow.loadFile('../frontend/dist/index.html')
    this.mainWindow.loadURL('http://localhost:3000')
    // this.mainWindow.on('closed', this.onClose);


    const projectFolder = "C:\\Users\\ivang\\source\\repos\\dnd\\stories\\sukkubinquitepool"

    const manager = new ConfigurationManager();

    const config = manager.TryReadProjectConfigurationFolder(projectFolder);

    const mainWindow = this.mainWindow;

    const api: applicationApi = new applicationApi(mainWindow);

    mainWindow.webContents.on('did-finish-load', () => {
      if (config) {
        api.project.onProjectOpen(config);
      }
    });

    api.file.receiveOpenMarkdown((event: any, filepath: string, node: SceneDefinition | OverviewDefinition) => {
      let content = fs.readFileSync(path.join(projectFolder, filepath), 'utf8');
      if (!content) {
        content = ""
      }
      api.file.onMarkdownOpen(content, node);
    });

    api.file.receiveSaveMarkdown((event: any, content: string, node: SceneDefinition | OverviewDefinition) => {
      fs.writeFileSync(path.join(projectFolder, node.file), content, {
        encoding: 'utf-8'
      });
    });

    api.project.receiveProjectItemClicked((event: any, node: ProjectTreeItem) => {
      api.project.onProjectItemClicked(node);
    });

    api.file.receiveFileChanged((event: any, node: SceneDefinition | OverviewDefinition) => {
      api.file.onFileChanged(node);
    });

    api.application.receiveSaveRequest((event: any) => {
      api.application.onSaveRequest();
    });

    api.project.handleGetAvailableItems((event: any) => {

      const locations : SceneDefinition[] = [];
      const vist = (scenes: SceneDefinition[]) => {
        scenes.forEach(element => {
          locations.push(element);
          if (element.scenes) {
            vist(element.scenes);
          }
        });
      }

      vist(config?.scenes ?? []);
      const result: (OverviewDefinition | SceneDefinition | NpcDefinition | ArtifactDefinition)[] = [...locations, ...config?.artifacts ?? [], ...config?.npces ?? []];

      return result;
    });

    api.file.handleGetFilePreview((event: any, filePath: string) => {
      let content = fs.readFileSync(path.join(projectFolder, filePath), 'utf8');
      if (!content) {
        content = ""
      }
      return content;
    })
  }

  public Save(): void {
    const api = new applicationApi(this.mainWindow!);

    api.application.onSaveRequest();
  }
}
