import { BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default class Main {
    static mainWindow;
    static application;
    static BrowserWindow;
    static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
    static onClose() {
        // Dereference the window object. 
        Main.mainWindow = null;
    }
    static onReady() {
        Main.mainWindow = new BrowserWindow({ width: 800, height: 600 });
        // Main.mainWindow.loadFile('../frontend/dist/index.html')
        Main.mainWindow.loadURL('http://localhost:3000');
        Main.mainWindow.on('closed', Main.onClose);
    }
    static main(app, browserWindow) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
