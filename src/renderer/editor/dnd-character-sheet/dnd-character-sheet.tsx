import { useEffect, useMemo, useRef, useState } from 'react';
import './dnd-character-sheet.css';
import DnDStatsBlock from './dnd-stats-block';
import { CharacterSheet as DnDCharacterSheetModel } from './dnd-character-sheet-model';
import { createModelStore } from './use-model-store';
import TextEditable from './text-editable';
import ListEditable from './list-editable';

export type DnDCharacterSheetProperties = {
  name?: string
  model?: DnDCharacterSheetModel
  node?: IFileDefinition
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

  const characterStoreRef = useRef(createModelStore(props));
  const characterStore = characterStoreRef.current;

  characterStore.subscribe((e: any) => {
    if (props.node)
      window.applicationApi.file.sendFileChanged(props.node)
  });

  const save = () => {
    const model = characterStore.getState().model.model;
    const node = characterStore.getState().model.node;
    if (model && node) {
      window.applicationApi.file.sendSaveCharacter(model, node);
    }
  }

  useEffect(() => {
    window.applicationApi.application.subscribe_onSaveRequest(save);
    return () => window.applicationApi.application.unsubscribe_onSaveRequest(save);
  });


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
              <ListEditable
                editable={editable}
                label='Снаряжение'
                store={characterStore}
                path={x => x.model?.equipment}
                itemTemplate={[
                  { type: 'text', path: (x) => x.name },
                  { type: 'quantity', path: (x) => x.quantity },
                  { type: 'separator', path: (x) => undefined },
                  { type: 'text', path: (x) => x.description }
                ]}
              />
            </section>
            <section className="abilities">
              <ListEditable
                editable={editable}
                label='Способности'
                store={characterStore}
                path={x => x.model?.featuresAndTraits}
                itemTemplate={[
                  { type: 'text', path: (x) => x.name },
                  { type: 'separator', path: (x) => undefined },
                  { type: 'text', path: (x) => x.description }
                ]}
              />
            </section>
            <section className="proficiencies">
              <ListEditable
                editable={editable}
                label='Владения и навыки'
                store={characterStore}
                path={x => x.model?.skills}
                itemTemplate={[
                  { type: 'text', path: (x) => x.name },
                  { type: 'separator', path: (x) => undefined },
                  { type: 'text', path: (x) => x.modifier },
                ]}
              />
            </section>
            <section className="spells">
              <ListEditable
                editable={editable}
                label='Заклинания'
                store={characterStore}
                path={x => x.model?.spells}
                itemTemplate={[
                  { type: 'text', path: (x) => x.name }
                ]}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
