import { app, BrowserWindow, Menu, MenuItem, dialog } from 'electron';
import Main from './main.js';

const main = new Main(app, BrowserWindow);

const mainMenu = new Menu();

const handleOpen = () => {

}

const handleNew = async () => {
  const result = await dialog.showOpenDialog({
    title: 'Select a folder to save the project',
    properties: ['openDirectory', 'createDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    console.log('Selected folder:', selectedPath);
    // You can now use this path to save your file
  }
}

const fileMenu = new MenuItem({
  label: "File",
  role: 'fileMenu',
  submenu: [
    {
      label: 'New',
      click: handleNew
    },
    {
      accelerator: 'Ctrl+O',
      label: 'Open',
      click: handleOpen
    },
    {
      accelerator: 'Ctrl+S',
      label: "Save",
      click: () => main.Save()
    }]
})

mainMenu.append(fileMenu);

const debugMenu = new MenuItem({
  role: 'viewMenu'
});

mainMenu.append(debugMenu);
Menu.setApplicationMenu(mainMenu);
