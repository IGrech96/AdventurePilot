import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import Main from './main.js';

const main = new Main(app, BrowserWindow);

const mainMenu = new Menu();

const fileMenu = new MenuItem({
    label: "File",
    role: 'fileMenu',
    submenu: [{
        accelerator: 'Ctrl+S',
        label: "Save",
        click:  () => main.Save()
    }]
})

mainMenu.append(fileMenu);

const debugMenu = new MenuItem({
    role: 'viewMenu'
});

mainMenu.append(debugMenu);
Menu.setApplicationMenu(mainMenu);
