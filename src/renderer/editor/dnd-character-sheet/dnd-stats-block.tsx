import './dnd-stats-block.css'

export type StatsBlockProperties = {
  name: string;
  value: number;
  shape: 'shield' | 'octagon' | 'heart' | 'chevron';
  modificator?: boolean;
}

export default function DnDStatsBlock(prop: StatsBlockProperties) {
  return (
    <>
      <div className="stat-block">
        <div className={`stat-block-${prop.shape} value`}>{prop.value}</div>
        <div className="property-name">{prop.name}</div>
      </div>
    </>
  )
}
