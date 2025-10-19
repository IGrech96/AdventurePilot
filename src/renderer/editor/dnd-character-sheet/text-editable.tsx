import { ModelStore } from "./use-model-store";
import './text-editable.css'
import { FormEvent, FocusEvent, useState } from "react";
import { StoreApi, UseBoundStore, useStore } from "zustand";

export type TextEditableProperties<T> = {
  store: UseBoundStore<StoreApi<ModelStore<T>>>;
  path: (model: T) => any
  editable?: boolean;
  placeholder?: string;
  defaultValue?: any;
}

function coalesce(left: any, defaultValue: any): any {
  return left ?? defaultValue;
}

export default function TextEditable<T>(props: TextEditableProperties<T>) {
  // const [value, setValue] = useState(coalesce(props.store.getValue(props.path), props.defaultValue))
  const value = useStore(props.store, (state) => coalesce(state.getValue(props.path), props.defaultValue));
  const placeholder = props.defaultValue ?? props.placeholder ?? '  '

  const handleBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const newText = e.currentTarget.textContent;
    // setValue(newText)
    // props.store..updateModel(props.path, value);
    props.store.getState().updateModel(props.path, newText);

  }

  return (
    <span
      contentEditable={props.editable}
      className={props.editable ? 'editable-text-field' : ''}
      data-placeholder={placeholder}
      data-focused-advice={placeholder}
      suppressContentEditableWarning
      // onInput={handleInput}
      onBlur={handleBlur}>
      {value}
    </span>

  )
}
