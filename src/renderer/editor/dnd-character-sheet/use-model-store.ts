import { create } from 'zustand';
import { CharacterSheet as DnDCharacterSheetModel } from './dnd-character-sheet-model';

export type ModelStore<T> = {
  model: T;
  updateModel: (path: (model: T) => any, value: any) => void;
  getValue: (path: (model: T) => any) => any;
};

export function createModelStore<T>(initialModel: T) {
  return create<ModelStore<T>>((set, get) => ({
    model: initialModel,
    getValue: (expression: (model: T) => any) => {

      const path = getPath(expression);
      const model = get().model;
      let target = model as any;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      return target[path[path.length - 1]];
    },
    updateModel: (expression: (model: T) => any, value) =>

      set((state) => {
        const path = getPath(expression);
        const newModel = structuredClone(state.model);
        let target = newModel as any;
        for (let i = 0; i < path.length - 1; i++) {
          target = target[path[i]];
        }
        target[path[path.length - 1]] = value;
        return { model: newModel };
      }),
  }))();
}

function getPath<T>(expr: (obj: T) => any): string[] {
  const path: string[] = [];

  const proxy = new Proxy({}, {
    get(_, prop) {
      path.push(String(prop));
      return proxy;
    }
  });

  expr(proxy as T);
  return path;
}
