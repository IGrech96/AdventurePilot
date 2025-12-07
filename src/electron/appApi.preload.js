const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('applicationApi', {
    project: {
        sendCreateNewCancelled: () => {
            ipcRenderer.send('new-project-canceled', );
        },
        sendCreateNew: (name, path) => {
            ipcRenderer.send('new-project', name, path);
        },
        subscribe_onProjectOpen: (callback) => {
            ipcRenderer.on('project-opened', callback);
        },
        unsubscribe_onProjectOpen: (callback) => {
            ipcRenderer.removeListener('project-opened', callback);
        },
        sendProjectItemClicked: (node) => {
            ipcRenderer.send('item-clicked', node);
        },
        subscribe_onProjectItemClicked: (callback) => {
            ipcRenderer.on('item-clicked', callback);
        },
        unsubscribe_onProjectItemClicked: (callback) => {
            ipcRenderer.removeListener('item-clicked', callback);
        },
        invokeGetAvailableItems: () => {
            return ipcRenderer.invoke('get-available-items', );
        },
        invokeCreateScene: (parent) => {
            return ipcRenderer.invoke('create-new-scene', parent);
        },
    },
    file: {
        invokeSelectFolder: () => {
            return ipcRenderer.invoke('select-folder', );
        },
        subscribe_onDefaultProjectFolder: (callback) => {
            ipcRenderer.on('default-folder', callback);
        },
        unsubscribe_onDefaultProjectFolder: (callback) => {
            ipcRenderer.removeListener('default-folder', callback);
        },
        sendOpenDefinition: (node) => {
            ipcRenderer.send('open-definition', node);
        },
        subscribe_ondefinitionOpen: (callback) => {
            ipcRenderer.on('definition-opened', callback);
        },
        unsubscribe_ondefinitionOpen: (callback) => {
            ipcRenderer.removeListener('definition-opened', callback);
        },
        sendSaveMarkdown: (content, node) => {
            ipcRenderer.send('save-markdown', content, node);
        },
        sendSaveCharacter: (content, node) => {
            ipcRenderer.send('save-character', content, node);
        },
        sendFileChanged: (node) => {
            ipcRenderer.send('file-changed', node);
        },
        subscribe_onFileChanged: (callback) => {
            ipcRenderer.on('file-changed', callback);
        },
        unsubscribe_onFileChanged: (callback) => {
            ipcRenderer.removeListener('file-changed', callback);
        },
        invokeGetFilePreview: (filePath) => {
            return ipcRenderer.invoke('get-file-preview', filePath);
        },
        invokeSaveItemImage: (node, imageName, data) => {
            return ipcRenderer.invoke('save-item-image', node, imageName, data);
        },
        invokeGetImageAsBase64: (path) => {
            return ipcRenderer.invoke('get-image-as-base64', path);
        },
    },
    application: {
        sendSaveRequest: () => {
            ipcRenderer.send('invoke-save', );
        },
        subscribe_onSaveRequest: (callback) => {
            ipcRenderer.on('save-requested', callback);
        },
        unsubscribe_onSaveRequest: (callback) => {
            ipcRenderer.removeListener('save-requested', callback);
        },
    },
});