import { TreeViewDefaultItemModelProperties } from "@mui/x-tree-view";

export type nodetype = "reserved" | "scene" | "overview";

export type ProjectTreeViewItem<R extends {} = TreeViewDefaultItemModelProperties> = R & {
  children?: ProjectTreeViewItem<R>[];
  path?: string;
  type: nodetype;
  source?: OverviewDefinition | SceneDefinition
};

export function toTree(data: ProjectConfiguration | null): ProjectTreeViewItem[] {
  let iterator = 0;
  const extractLocations = (scenes: SceneDefinition[] | undefined | null):ProjectTreeViewItem[] =>{
    if (!scenes) return [];
    const data: ProjectTreeViewItem[] = scenes.map(x => ({
      id: (iterator++).toString(),
      label: x.name,
      type: 'scene',
      path: x.file,
      source: x,
      children: extractLocations(x.scenes)
    }));

    return data;
  }
  return [
    {
      id: (iterator++).toString(), label: data?.overview?.name ?? "Adventure" , type: 'reserved', children: [
        { id: (iterator++).toString(), label: "Overview", type: 'overview', path: data?.overview?.file, source: data?.overview },
        { id: (iterator++).toString(), label: "Locations", type: 'reserved', children: extractLocations(data?.scenes)  },
      ]
    }
  ]
}

export function findNode(collection: ProjectTreeViewItem[], id: string) : ProjectTreeViewItem{
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
