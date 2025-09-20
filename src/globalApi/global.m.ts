
export interface IDefinition {
  name: string
  type: DefinitionType
}

export interface IFileDefinition extends IDefinition {
  file: string
}

export type DefinitionType = 'overview' | 'scene' | 'common' | 'npc'

export interface ProjectConfiguration {
  overview: OverviewDefinition;
  scenes: SceneDefinition[];
  common: CommonDefinition;
  npces: NpcDefinition[];
}
export interface SceneDefinition extends IDefinition, IFileDefinition {
  scenes: SceneDefinition[];
}
export interface OverviewDefinition extends IDefinition, IFileDefinition {
}
export interface CommonDefinition extends IDefinition, IFileDefinition {
}
export interface NpcDefinition extends IDefinition, IFileDefinition {
  engine: string
  attributes: any
}
export interface ProjectTreeItem {
  children?: ProjectTreeItem[];
  type: nodetype;
  source?: IDefinition;
}

export type nodetype =
  'reserved' |
  'scenes-root' |
  'npces-root' |
  DefinitionType;
