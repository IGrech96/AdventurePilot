import './dnd-stats-block.css'

export type StatsBlockProperties = {
  name: string;
  value?: number;
  shape: 'shield' | 'octagon' | 'heart' | 'chevron';
  modificator?: boolean;
  mark?: boolean;
}

export default function DnDStatsBlock(prop: StatsBlockProperties) {
  return (
    <>
      <div className="stat-block">
        <div className={`stat-block-${prop.shape} value`}>{prop.value}</div>
        <div className="property-name">{prop.mark && <span className="save-icon">🛡️</span>}{prop.name}</div>
      </div>
    </>
  )
}
