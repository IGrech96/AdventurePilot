import React from 'react';
import './dnd-character-sheet.css';
import DnDStatsBlock from './dnd-stats-block';

const DnDCharacterSheet: React.FC = () => {
  return (
    <div className="sheet-container">
      <header className="sheet-header">
        <h1>🎸 Роленрок Метал</h1>
        <h2>Сатир, Бард</h2>
      </header>

      <div className='sheet-2side'>
        <div>
          <section className="stats-grid">
            <DnDStatsBlock name='Класс Брони' value={14} shape='shield' />
            <DnDStatsBlock name='Скорость' value={35} shape='octagon' />
            <DnDStatsBlock name='Мак Здоровье' value={32} shape='heart' />
            <DnDStatsBlock name='Тек. Здоровье' value={32} shape='heart' />
          </section>
        </div>
        <div>
          <section className="mod-grid">
            <DnDStatsBlock name='СИЛ' value={0} shape='chevron' modificator={true} />
            <DnDStatsBlock name='ЛОВ' value={3} shape='chevron' modificator={true} />
            <DnDStatsBlock name='ТЕЛ' value={1} shape='chevron' modificator={true} />
            <DnDStatsBlock name='ИНТ' value={-2} shape='chevron' modificator={true} />
            <DnDStatsBlock name='МДР' value={0} shape='chevron' modificator={true} />
            <DnDStatsBlock name='ХАР' value={3} shape='chevron' modificator={true} />
          </section>
          <div className="stuff-grid">
            <section className="equipment">
              <h3>Снаряжение</h3>
              <ul>
                <li>Рапира (+5 атака, 1d8+3 урон)</li>
                <li>Кожаная броня</li>
                <li>Набор для маскировки</li>
                <li>Мандолина</li>
                <li>Мешочек с 46 зубами</li>
              </ul>
            </section>
            <section className="abilities">
              <h3>Способности</h3>
              <ul>
                <li>Экспертиза: двойной бонус мастерства</li>
                <li>Вдохновение барда (3 раза): d6 бонус союзнику</li>
                <li>Песнь отдыха: +1d6 HP при коротком отдыхе</li>
                <li>На все руки мастер: +1 к не-мастерским проверкам</li>
                <li>Магия: ХАР-базовая, DC 13, атака +5</li>
              </ul>
            </section>
            <section className="proficiencies">
              <h3>Владения и навыки</h3>
              <ul>
                <li>Спасброски: Ловкость +, Харизма +</li>
                <li>Владение оружием: Рапира +5</li>
                <li>Выступление +5</li>
                <li>Обман +5</li>
                <li>Убеждение +5</li>
              </ul>
            </section>
            <section className="spells">
              <h3>Заклинания (2 уровень)</h3>
              <ul>
                <li>Целительное слово</li>
                <li>Огни фей</li>
                <li>Диссонантные шепоты</li>
                <li>Язвительная насмешка</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnDCharacterSheet;
