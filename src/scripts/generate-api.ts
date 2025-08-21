
import fs from 'fs'
import yaml from 'js-yaml';


const args = process.argv.slice(2)

const declaration = args[1];

const fileContents = fs.readFileSync(declaration, 'utf8');
const data = yaml.load(fileContents) as any;

// generate-preload.ts
const preloadLines: string[] = [
    `const { contextBridge, ipcRenderer } = require('electron')`,
]

const rendererGlobalApi: string[] = [
    "export {}",
    "",
    "declare global {",
]

const electronMainApi: string[] = [
    "import { BrowserWindow } from 'electron';",
    "import { ipcMain } from 'electron';",
    ""
]

const indent = (level: number): string => {
    return '    '.repeat(level);
}

if (data && data.api) {
    const apis = Object.keys(data.api)
    rendererGlobalApi.push(`${indent(1)}interface Window {`,);

    apis.forEach(apiName => {
        preloadLines.push(`contextBridge.exposeInMainWorld('${apiName}', {`);
        rendererGlobalApi.push(`${indent(2)}${apiName}: {`);

        electronMainApi.push(`export class ${apiName} {`);
        electronMainApi.push(...[`${indent(1)}constructor(protected window: BrowserWindow) {`, `${indent(1)}}`]);

        const domains = Object.keys(data.api[apiName]);
        domains.forEach(domainName => {
            preloadLines.push(`${indent(1)}${domainName}: {`);
            rendererGlobalApi.push(`${indent(3)}${domainName}: {`);
            electronMainApi.push(`${indent(1)}public ${domainName} = {`);

            const methods = Object.keys(data.api[apiName][domainName]);

            methods.forEach(methodName => {

                const isEvent = methodName.startsWith('on');
                const args: any[] = !!data.api[apiName][domainName][methodName].args
                    ? Object.values(data.api[apiName][domainName][methodName].args)
                    : [];
                const channel = data.api[apiName][domainName][methodName].channel;

                const argNames = args.map(x => Object.keys(x)[0]);
                const argNameDefinitions = args.map(x => `${Object.keys(x)[0]}: ${x[Object.keys(x)[0]]}`);

                if (isEvent) {
                    preloadLines.push(`${indent(2)}subscribe_${methodName}: (callback) => {`);
                    preloadLines.push(`${indent(3)}ipcRenderer.on('${channel}', callback);`);
                    preloadLines.push(`${indent(2)}},`);

                    preloadLines.push(`${indent(2)}unsubscribe_${methodName}: (callback) => {`);
                    preloadLines.push(`${indent(3)}ipcRenderer.removeListener('${channel}', callback);`);
                    preloadLines.push(`${indent(2)}},`);

                    rendererGlobalApi.push(`${indent(4)}subscribe_${methodName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => void) => void;`)
                    rendererGlobalApi.push(`${indent(4)}unsubscribe_${methodName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => void) => void;`)

                    electronMainApi.push(`${indent(2)}${methodName}: (${argNameDefinitions.join(', ')}) => {`)
                    electronMainApi.push(`${indent(3)}this.window.webContents.send('${channel}', ${argNames.join(', ')});`)
                    electronMainApi.push(`${indent(2)}},`);
                }
                else {
                    preloadLines.push(`${indent(2)}${methodName}: (${argNames.join(', ')}) => {`);
                    preloadLines.push(`${indent(3)}ipcRenderer.send('${data.api[apiName][domainName][methodName].channel}', ${argNames.join(', ')});`);
                    preloadLines.push(`${indent(2)}},`);

                    const argNamesTs = args.map(x => `${Object.keys(x)[0]}: ${x[Object.keys(x)[0]]}`);
                    rendererGlobalApi.push(`${indent(4)}${methodName}: (${argNamesTs.join(', ')}) => void;`)

                    electronMainApi.push(`${indent(2)}${methodName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => void) => {`)
                    electronMainApi.push(`${indent(3)}ipcMain.on('${channel}', callback);`)
                    electronMainApi.push(`${indent(2)}},`);
                }
            });

            preloadLines.push(`${indent(1)}},`);
            rendererGlobalApi.push(`${indent(3)}},`);
            electronMainApi.push(`${indent(1)}}`);
        });

        preloadLines.push('});');
        rendererGlobalApi.push(`${indent(2)}},`);
        electronMainApi.push(`}`);
    });

    rendererGlobalApi.push(`${indent(1)}}`)
}

if (data && data.models) {
    const models = Object.keys(data.models);

    models.forEach(modelName => {
        rendererGlobalApi.push(`${indent(1)}export interface ${modelName} {`);
        electronMainApi.push(`export interface ${modelName} {`);

        const properties = Object.keys(data.models[modelName]);

        properties.forEach(element => {
            rendererGlobalApi.push(`${indent(2)}${element}: ${data.models[modelName][element]};`);
            electronMainApi.push(`${indent(1)}${element}: ${data.models[modelName][element]};`);
        });

        rendererGlobalApi.push(`${indent(1)}}`);
        electronMainApi.push(`}`);
    });
}

rendererGlobalApi.push("}");

fs.writeFileSync('src/electron/appApi.preload.js', preloadLines.join('\n'))
fs.writeFileSync('src/renderer/appApi.d.ts', rendererGlobalApi.join('\n'))
fs.writeFileSync('src/electron/appApi.ts', electronMainApi.join('\n'))
