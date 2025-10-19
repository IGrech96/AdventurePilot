import BoolEditable from './bool-editable';
import './dnd-stats-block.css'
import TextEditable from './text-editable';
import { ModelStore } from './use-model-store';

export type StatsBlockProperties<T> = {
  name: string;
  store: ModelStore<T>;
  valuePath: (model: T) => any
  markPath?: (model: T) => any
  shape: 'shield' | 'octagon' | 'heart' | 'chevron';
  modificator?: boolean;
  editable?: boolean;
}

export default function DnDStatsBlock<T>(prop: StatsBlockProperties<T>) {
  const mark = prop.markPath ? prop.store.getValue(prop.markPath) : null
  return (
    <>
      <div className="stat-block">
        {/* <div contentEditable={prop.editable} className={`stat-block-${prop.shape} value`}>{prop.value}</div> */}
        <div className={`stat-block-${prop.shape} value`}>
          <TextEditable editable={prop.editable} store={prop.store} path={prop.valuePath} placeholder='0' />
        </div>
        <div className="property-name">
          { prop.markPath && (mark || prop.editable) && <BoolEditable emoji='🛡️' editable={prop.editable} path={prop.markPath} store={prop.store} />}
          <span>{prop.name}</span></div>
      </div>
    </>
  )
}
