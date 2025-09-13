import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import ConfigurationManager from './config.js';
import { applicationApi } from './appApi.js';
import { ApiHandlers } from './api.handlers.js';


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
        const handlers = new ApiHandlers(projectFolder, config);

        handlers.Subscribe(api);
      }
    });
  }

  public Save(): void {
    const api = new applicationApi(this.mainWindow!);

    api.application.onSaveRequest();
  }
}
