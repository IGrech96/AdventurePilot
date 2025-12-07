
import fs from 'fs'
import yaml from 'js-yaml';

function normilizePreloadArgNames(name: string) : string{
  if (name.endsWith('?')){
    name = name.slice(0, name.length - 1);
  }

  return name;
}


const args = process.argv.slice(2)

const declaration = args[1];

const fileContents = fs.readFileSync(declaration, 'utf8');
const data = yaml.load(fileContents) as any;

const mContents = fs.readFileSync("src/globalApi/global.m.ts", 'utf8');
const fContents = fs.readFileSync("src/globalApi/global.f.ts", 'utf8');

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

        let type: 'send' | 'on' | 'invoke';
        if (methodName.startsWith('on')) {
          type = 'on';
        } else if (methodName.startsWith('send')) {
          type = 'send'
        } else if (methodName.startsWith('invoke')) {
          type = 'invoke';
        }
        else {
          throw 'InvalidMethodType';
        }

        const args: any[] = !!data.api[apiName][domainName][methodName].args
          ? Object.values(data.api[apiName][domainName][methodName].args)
          : [];
        const channel = data.api[apiName][domainName][methodName].channel;

        const argNames = args.map(x => Object.keys(x)[0]);
        const argNameDefinitions = args.map(x => `${Object.keys(x)[0]}: ${x[Object.keys(x)[0]]}`);

        if (type == 'on') {
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
        else if (type == 'send') {
          preloadLines.push(`${indent(2)}${methodName}: (${argNames.map(x => normilizePreloadArgNames(x)).join(', ')}) => {`);
          preloadLines.push(`${indent(3)}ipcRenderer.send('${data.api[apiName][domainName][methodName].channel}', ${argNames.map(x => normilizePreloadArgNames(x)).join(', ')});`);
          preloadLines.push(`${indent(2)}},`);

          const argNamesTs = args.map(x => `${Object.keys(x)[0]}: ${x[Object.keys(x)[0]]}`);
          rendererGlobalApi.push(`${indent(4)}${methodName}: (${argNamesTs.join(', ')}) => void;`)

          const receiveName = methodName.replace('send', 'receive');
          electronMainApi.push(`${indent(2)}subscribe_${receiveName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => void) => {`)
          electronMainApi.push(`${indent(3)}ipcMain.on('${channel}', callback);`)
          electronMainApi.push(`${indent(2)}},`);

          electronMainApi.push(`${indent(2)}unsubscribe_${receiveName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => void) => {`)
          electronMainApi.push(`${indent(3)}ipcMain.removeListener('${channel}', callback);`)
          electronMainApi.push(`${indent(2)}},`);
        } else {
          const sourceReturn = data.api[apiName][domainName][methodName].return;
          const ret = `Promise<${sourceReturn}> | ${sourceReturn}`;
          preloadLines.push(`${indent(2)}${methodName}: (${argNames.map(x => normilizePreloadArgNames(x)).join(', ')}) => {`);
          preloadLines.push(`${indent(3)}return ipcRenderer.invoke('${data.api[apiName][domainName][methodName].channel}', ${argNames.map(x => normilizePreloadArgNames(x)).join(', ')});`);
          preloadLines.push(`${indent(2)}},`);

          const argNamesTs = args.map(x => `${Object.keys(x)[0]}: ${x[Object.keys(x)[0]]}`);
          rendererGlobalApi.push(`${indent(4)}${methodName}: (${argNamesTs.join(', ')}) => Promise<${ret}>;`)

          const handleName = methodName.replace('invoke', 'handle');
          electronMainApi.push(`${indent(2)}subscribe_${handleName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => ${ret}) => {`)
          electronMainApi.push(`${indent(3)}ipcMain.handle('${channel}', callback);`)
          electronMainApi.push(`${indent(2)}},`);

          electronMainApi.push(`${indent(2)}unsubscribe_${handleName}: (callback: (event: any, ${argNameDefinitions.join(', ')}) => ${ret}) => {`)
          electronMainApi.push(`${indent(3)}ipcMain.removeListener('${channel}', callback);`)
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


rendererGlobalApi.push(mContents);
electronMainApi.push(mContents);
electronMainApi.push(fContents);

rendererGlobalApi.push("}");
rendererGlobalApi.push(fContents);

fs.writeFileSync('src/electron/appApi.preload.js', preloadLines.join('\n'))
fs.writeFileSync('src/renderer/appApi.d.ts', rendererGlobalApi.join('\n'))
fs.writeFileSync('src/electron/appApi.ts', electronMainApi.join('\n'))
