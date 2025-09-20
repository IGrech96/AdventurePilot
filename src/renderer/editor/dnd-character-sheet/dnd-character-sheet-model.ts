export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skill {
  name: string;
  modifier: number;
  proficient: boolean;
}

export interface EquipmentItem {
  name: string;
  quantity: number;
  description?: string;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
}

export interface CombatStats {
  armorClass: number;
  speed: number;
  hitPoints: {
    max: number;
    current: number;
  };
}

export interface FeaturesAndTraitsItem {
  name: string;
  description?: string;
}

export interface CharacterSheet {
  race: string;
  class: string;
  level?: number;
  background?: string;
  alignment?: string;
  experiencePoints?: number;
  proficiencyBonus: number;
  abilityScores: AbilityScores;
  skills: Skill[];
  combat: CombatStats;

  savingThrows: Partial<Record<keyof AbilityScores, boolean>>;
  equipment: EquipmentItem[];
  featuresAndTraits: FeaturesAndTraitsItem[];
  spells: Spell[];
  spellSlots: Record<number, { max: number; used: number }>;

  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
}
