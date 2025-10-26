// main.ts
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { applicationApi } from '../appApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ProjectDialog {

  private mainWindow: BrowserWindow;
  private api: applicationApi;
  private name?: string;
  private path?: string;

  constructor(
    private application: Electron.App,
    private browserWindow: typeof Electron.BrowserWindow
  ) {

    this.mainWindow = new BrowserWindow({
      width: 500,
      height: 400,
      modal: true,
      parent: BrowserWindow.getFocusedWindow() ?? undefined,
      webPreferences: {
        preload: path.join(__dirname, './../appApi.preload.js'),
        // nodeIntegration: false,
        contextIsolation: true,
      },
    });
    this.mainWindow.setMenuBarVisibility(false);


    const onCreateNewCancelled = () => {
      this.mainWindow.close();
    };

    const onCreateNew = (e: any, name: string, path: string) => {
      this.name = name;
      this.path = path;
      this.mainWindow.close();
    };

    const onClose = () => {
      this.api.project.unsubscribe_receiveCreateNew(onCreateNew);
      this.api.project.unsubscribe_receiveCreateNewCancelled(onCreateNewCancelled);
      this.mainWindow.removeListener('close', onClose);
    };

    this.mainWindow.on('close', onClose);

    this.api = new applicationApi(this.mainWindow);
    this.api.project.subscribe_receiveCreateNewCancelled(onCreateNewCancelled);
    this.api.project.subscribe_receiveCreateNew(onCreateNew);

  }

  public showDialog(): Promise<{ name: string, path: string } | null> {

    return new Promise(async (resolve) => {
      await this.mainWindow.loadURL('http://localhost:3000/dialog'); // Or use loadFile for production
      this.mainWindow.on('closed', () => {

        if (this.name && this.path) {
          resolve({ name: this.name, path: this.path })
        }
        else {
          resolve(null);
        }
      });

      this.api.file.onDefaultProjectFolder("C:\\Users\\ivang\\source\\repos\\dnd\\stories");
    });
  }
}
