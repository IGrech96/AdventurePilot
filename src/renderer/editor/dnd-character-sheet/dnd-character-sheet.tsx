import { useEffect, useMemo, useRef, useState } from 'react';
import './dnd-character-sheet.css';
import DnDStatsBlock from './dnd-stats-block';
import { CharacterSheet as DnDCharacterSheetModel } from './dnd-character-sheet-model';
import { createModelStore } from './use-model-store';
import TextEditable from './text-editable';

export type DnDCharacterSheetProperties = {
  name?: string
  model?: DnDCharacterSheetModel
}



export default function DnDCharacterSheet(props: DnDCharacterSheetProperties) {

  const [editable, setEditable] = useState<boolean>(false)
  useEffect(() => {
    const target = document.documentElement // or document.body
    const observer = new MutationObserver(() => {
      setEditable(target.classList.contains('edit'));
    })

    observer.observe(target, { attributes: true, attributeFilter: ['class'] })

    // Initial check
    setEditable(target.classList.contains('edit'));

    return () => observer.disconnect()
  }, [setEditable])
  //TODO: model can be null/undefined
  // const characterStore = createModelStore<DnDCharacterSheetProperties>(props);
const characterStoreRef = useRef(createModelStore(props));
const characterStore = characterStoreRef.current;

  return (
    <div className="sheet-container">
      <header className="sheet-header">
        <h1><TextEditable editable={editable} store={characterStore} path={x => x.name} placeholder='Character Name' /></h1>
        <h2>
          <TextEditable editable={editable} store={characterStore} path={x => x.model?.race} placeholder='Race' />,
          <TextEditable editable={editable} store={characterStore} path={x => x.model?.class} placeholder='Class' />
        </h2>
      </header>

      <div className='sheet-2side'>
        <div>
          <section className="stats-grid">
            <DnDStatsBlock editable={editable} name='Класс Брони' store={characterStore} valuePath={x => x.model?.combat.armorClass} shape='shield' />
            <DnDStatsBlock editable={editable} name='Скорость' store={characterStore} valuePath={x => x.model?.combat.speed} shape='octagon' />
            <DnDStatsBlock editable={editable} name='Макc Здоровье' store={characterStore} valuePath={x => x.model?.combat.hitPoints?.max} shape='heart' />
            <DnDStatsBlock editable={editable} name='Тек. Здоровье' store={characterStore} valuePath={x => x.model?.combat.hitPoints?.current} shape='heart' />
          </section>
        </div>
        <div>
          <section className="mod-grid">
            <DnDStatsBlock editable={editable} name='СИЛ' store={characterStore} valuePath={x => x.model?.abilityScores.strength} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.strength} />
            <DnDStatsBlock editable={editable} name='ЛОВ' store={characterStore} valuePath={x => x.model?.abilityScores.dexterity} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.dexterity} />
            <DnDStatsBlock editable={editable} name='ТЕЛ' store={characterStore} valuePath={x => x.model?.abilityScores.constitution} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.constitution} />
            <DnDStatsBlock editable={editable} name='ИНТ' store={characterStore} valuePath={x => x.model?.abilityScores.intelligence} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.intelligence} />
            <DnDStatsBlock editable={editable} name='МДР' store={characterStore} valuePath={x => x.model?.abilityScores.wisdom} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.wisdom} />
            <DnDStatsBlock editable={editable} name='ХАР' store={characterStore} valuePath={x => x.model?.abilityScores.charisma} shape='chevron' modificator={true} markPath={x => x.model?.savingThrows?.charisma} />
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
