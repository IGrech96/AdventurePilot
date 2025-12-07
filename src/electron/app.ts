import { app, BrowserWindow, Menu, MenuItem, dialog } from 'electron';
import Main from './main.js';
import { ProjectDialog } from './dialogs/create-project.js'

const main = new Main(app, BrowserWindow);

const mainMenu = new Menu();

const handleOpen = () => {
  dialog.showOpenDialog({
    title: 'Select a folder',
    properties: ['openDirectory', 'createDirectory']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      if (!main.Open(result.filePaths[0])){
        dialog.showErrorBox("Invalid Folder", "The selected folder is not valid.")
      }
    }
  }).catch(err => {
    console.error('Error selecting folder:', err);
  });
}

const handleNew = async () => {

  const dialog = new ProjectDialog(app, BrowserWindow)
  const result = await dialog.showDialog();
  if (result) {
    main.CreateNew(result.name, result.path);
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
