import { ModelStore } from "./use-model-store";
import './bool-editable.css'
import { useState } from "react";
import { StoreApi, UseBoundStore, useStore } from "zustand";

export type BoolEditableProperties<T> = {
  store: UseBoundStore<StoreApi<ModelStore<T>>>;
  path: (model: T) => any
  editable?: boolean;
  placeholder?: string;
  emoji: string;
}

export default function BoolEditable<T>(props: BoolEditableProperties<T>) {

  const active = useStore(props.store, (state) => state.getValue(props.path));

  const classes = [''];
  if (props.editable) {
    classes.push('editable-bool-field')
  }

  if (active) {
    classes.push('active')
  }

  const handleToggle = () => {
    props.store.getState().updateModel(props.path, !active);
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
