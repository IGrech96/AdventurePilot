import { StoreApi, UseBoundStore, useStore } from 'zustand';
import BoolEditable from './bool-editable';
import './dnd-stats-block.css'
import TextEditable from './text-editable';
import { ModelStore } from './use-model-store';

export type StatsBlockProperties<T> = {
  name: string;
  store: UseBoundStore<StoreApi<ModelStore<T>>>;
  valuePath: (model: T) => any
  markPath?: (model: T) => any
  shape: 'shield' | 'octagon' | 'heart' | 'chevron';
  modificator?: boolean;
  editable?: boolean;
}

export default function DnDStatsBlock<T>(props: StatsBlockProperties<T>) {
  const mark = useStore(props.store, (state) => props.markPath ? state.getValue(props.markPath) : null);
  return (
    <>
      <div className="stat-block">
        {/* <div contentEditable={prop.editable} className={`stat-block-${prop.shape} value`}>{prop.value}</div> */}
        <div className={`stat-block-${props.shape} value`}>
          <TextEditable editable={props.editable} store={props.store} path={props.valuePath} placeholder='0' />
        </div>
        <div className="property-name">
          { props.markPath && (mark || props.editable) && <BoolEditable emoji='🛡️' editable={props.editable} path={props.markPath} store={props.store} />}
          <span>{props.name}</span></div>
      </div>
    </>
  )
}
