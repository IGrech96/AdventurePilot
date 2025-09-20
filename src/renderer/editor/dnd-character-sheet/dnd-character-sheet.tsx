import React from 'react';
import './dnd-character-sheet.css';
import DnDStatsBlock from './dnd-stats-block';
import { CharacterSheet as DnDCharacterSheetModel } from './dnd-character-sheet-model';

export type DnDCharacterSheetProperties = {
  name?: string
  model?: DnDCharacterSheetModel
}

export default function DnDCharacterSheet(props: DnDCharacterSheetProperties) {

  return (
    <div className="sheet-container">
      <header className="sheet-header">
        <h1>{props.name}</h1>
        <h2>{props.model?.race}, {props.model?.class}</h2>
      </header>

      <div className='sheet-2side'>
        <div>
          <section className="stats-grid">
            <DnDStatsBlock name='Класс Брони' value={props.model?.combat.armorClass} shape='shield' />
            <DnDStatsBlock name='Скорость' value={props.model?.combat.speed} shape='octagon' />
            <DnDStatsBlock name='Мак Здоровье' value={props.model?.combat.hitPoints?.max} shape='heart' />
            <DnDStatsBlock name='Тек. Здоровье' value={props.model?.combat.hitPoints?.current} shape='heart' />
          </section>
        </div>
        <div>
          <section className="mod-grid">
            <DnDStatsBlock name='СИЛ' value={props.model?.abilityScores.strength} shape='chevron' modificator={true} mark={props.model?.savingThrows?.strength} />
            <DnDStatsBlock name='ЛОВ' value={props.model?.abilityScores.dexterity} shape='chevron' modificator={true} mark={props.model?.savingThrows?.dexterity} />
            <DnDStatsBlock name='ТЕЛ' value={props.model?.abilityScores.constitution} shape='chevron' modificator={true} mark={props.model?.savingThrows?.constitution} />
            <DnDStatsBlock name='ИНТ' value={props.model?.abilityScores.intelligence} shape='chevron' modificator={true} mark={props.model?.savingThrows?.intelligence} />
            <DnDStatsBlock name='МДР' value={props.model?.abilityScores.wisdom} shape='chevron' modificator={true} mark={props.model?.savingThrows?.wisdom} />
            <DnDStatsBlock name='ХАР' value={props.model?.abilityScores.charisma} shape='chevron' modificator={true} mark={props.model?.savingThrows?.charisma} />
          </section>
          <div className="stuff-grid">
            <section className="equipment">
              <h3>Снаряжение</h3>
              <ul>
                {
                    props.model?.equipment.map((item, index) => {
                      const count = item.quantity > 1 ? `(x${item.quantity})` : ''
                      const separator = item.description ? ': ' : ''
                      return (
                        <li key={index}>{item.name}{count}{separator}{item.description}</li>
                      );
                    })
                }
              </ul>
            </section>
            <section className="abilities">
              <h3>Способности</h3>
              <ul>
                {
                    props.model?.featuresAndTraits.map((item, index) => {
                      const separator = item.description ? ': ' : ''
                      return (
                        <li key={index}>{item.name}{separator}{item.description}</li>
                      );
                    })
                }
              </ul>
            </section>
            <section className="proficiencies">
              <h3>Владения и навыки</h3>
              <ul>
                {
                    props.model?.skills.map((item, index) => {
                      return (
                        <li key={index}>{item.name}: {item.modifier}{item.proficient && <span className="save-icon">🧠</span>}</li>
                      );
                    })
                }
              </ul>
            </section>
            <section className="spells">
              <h3>Заклинания (2 уровень)</h3>
              <ul>
                {
                    props.model?.spells.map((item, index) => {
                      return (
                        <li key={index}>{item.name}</li>
                      );
                    })
                }
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
