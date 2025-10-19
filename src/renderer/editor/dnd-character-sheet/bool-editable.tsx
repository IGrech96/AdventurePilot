import { ModelStore } from "./use-model-store";
import './bool-editable.css'
import { useState } from "react";

export type BoolEditableProperties<T> = {
  store: ModelStore<T>;
  path: (model: T) => any
  editable?: boolean;
  placeholder?: string;
  emoji: string;
}

export default function BoolEditable<T>(props: BoolEditableProperties<T>) {

  const [active, setActive] = useState(props.store.getValue(props.path));

  const classes = [''];
  if (props.editable) {
    classes.push('editable-bool-field')
  }

  if (active) {
    classes.push('active')
  }

  const handleToggle = () => {
    props.store.updateModel(props.path, !active)
    setActive(!active);
  };

  return (
    <span
      className={classes.join(' ')}
      onClick={handleToggle}
      suppressContentEditableWarning>
      {props.emoji}
    </span>
  )
}
