const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('applicationApi', {
    project: {
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
    },
    file: {
        sendOpenMarkdown: (filePath, node) => {
            ipcRenderer.send('open-markdown', filePath, node);
        },
        subscribe_onMarkdownOpen: (callback) => {
            ipcRenderer.on('markdown-opened', callback);
        },
        unsubscribe_onMarkdownOpen: (callback) => {
            ipcRenderer.removeListener('markdown-opened', callback);
        },
        sendSaveMarkdown: (content, node) => {
            ipcRenderer.send('save-markdown', content, node);
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