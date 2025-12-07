import { TreeViewDefaultItemModelProperties } from "@mui/x-tree-view";


export type ProjectTreeViewItem<R extends {} = TreeViewDefaultItemModelProperties> = R & {
  children?: ProjectTreeViewItem<R>[];
  type: nodetype;
  source?: OverviewDefinition | SceneDefinition | CommonDefinition | NpcDefinition
};

export function toTree(data: ProjectConfiguration | null): ProjectTreeViewItem[] {
  let iterator = 0;
  const extractLocations = (scenes: SceneDefinition[] | undefined | null): ProjectTreeViewItem[] => {
    if (!scenes) return [];
    const data: ProjectTreeViewItem[] = scenes.map(x => ({
      id: (iterator++).toString(),
      label: x.name,
      type: 'scene',
      source: x,
      children: extractLocations(x.scenes)
    }));

    return data;
  }
  const extractother = (input: NpcDefinition[] | CommonDefinition[] | undefined | null, type: nodetype): ProjectTreeViewItem[] => {
    if (!input) return [];
    const data: ProjectTreeViewItem[] = input.map(x => ({
      id: (iterator++).toString(),
      label: x.name,
      type: type,
      source: x,
    }));

    return data;
  }
  return [
    {
      id: (iterator++).toString(), label: data?.overview?.name ?? "Adventure", type: 'overview', source: data?.overview, children: [
        { id: (iterator++).toString(), label: "Locations", type: 'scenes-root', children: extractLocations(data?.scenes) },
        { id: (iterator++).toString(), label: "NPCes", type: 'npces-root', children: extractother(data?.npces, 'npc') },
        { id: (iterator++).toString(), label: "Common", type: 'common', source: data?.common },
      ]
    }
  ]
}

export function findNode(collection: ProjectTreeViewItem[], id: string): ProjectTreeViewItem {
  if (id == "0") return collection[0];

  const [parent, index] = findPositionInParent(collection, id)!;
  return parent.children![index];
}

export function findPositionInParent(collection: ProjectTreeViewItem[], id: string | undefined): [ProjectTreeViewItem, number] {

  const recursiveSearch = (currentParent: ProjectTreeViewItem): [ProjectTreeViewItem, number] | null => {
    if (currentParent.children) {
      for (let index = 0; index < currentParent.children.length; index++) {
        const element = currentParent.children[index];
        if (element.id === id) {
          return [currentParent, index]
        }

        const fromChild = recursiveSearch(element);
        if (fromChild) {
          return fromChild
        }
      }
    }
    return null;
  }

  return recursiveSearch(collection[0])!
}

function getLastId(collection: ProjectTreeViewItem[]): number {
  let currentMaxId = 0;
  for (let index = 0; index < collection.length; index++) {
    const item = collection[index];
    currentMaxId = Math.max(Number(item.id), currentMaxId);

    if (item.children){
      currentMaxId = Math.max(currentMaxId, getLastId(item.children))
    }
  }
  return currentMaxId;
}

export function getNextId(collection: ProjectTreeViewItem[]): number {
  const lastId = getLastId(collection);
  return lastId + 1;
}
