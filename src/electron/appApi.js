const { contextBridge, ipcRenderer } = require('electron');
// You can't import types in JS, so skip ProjectConfiguration

contextBridge.exposeInMainWorld('applicationAPI', {
  saveProject: (data) => {
    ipcRenderer.send("saveProjectConfiguration", data);
  },

  onProjectOpen: (callback) => {
    ipcRenderer.on('OpenProject', (_event, data) => callback(data));
  }
});