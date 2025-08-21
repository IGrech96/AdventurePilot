const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('applicationApi', {
    project: {
        subscribe_onProjectOpen: (callback) => {
            ipcRenderer.on('project-opened', callback);
        },
        unsubscribe_onProjectOpen: (callback) => {
            ipcRenderer.removeListener('project-opened', callback);
        },
    },
    file: {
        invokeOpenMarkdown: (filePath, node) => {
            ipcRenderer.send('open-markdown', filePath, node);
        },
        subscribe_onMarkdownOpen: (callback) => {
            ipcRenderer.on('markdown-opened', callback);
        },
        unsubscribe_onMarkdownOpen: (callback) => {
            ipcRenderer.removeListener('markdown-opened', callback);
        },
        invokeSaveMarkdown: (content, node) => {
            ipcRenderer.send('save-markdown', content, node);
        },
    },
    application: {
        subscribe_onSaveRequest: (callback) => {
            ipcRenderer.on('save-requested', callback);
        },
        unsubscribe_onSaveRequest: (callback) => {
            ipcRenderer.removeListener('save-requested', callback);
        },
    },
});