import { ModelStore } from "./use-model-store";
import './text-editable.css'
import { FormEvent, useState } from "react";

export type TextEditableProperties<T> = {
  store: ModelStore<T>;
  path: (model: T) => any
  editable?: boolean;
  placeholder?: string;
}

export default function TextEditable<T>(props: TextEditableProperties<T>) {
  const [value, setValue] = useState(props.store.getValue(props.path))
  const placeholder = props.placeholder ?? '  '

  const handleInput = (e: FormEvent<HTMLSpanElement>) => {
    const newText = e.currentTarget.textContent ?? '';
    setValue(newText)
    props.store.updateModel(props.path, newText);
  }

  return (
    <span
      contentEditable={props.editable}
      className={props.editable ? 'editable-text-field' : ''}
      data-placeholder={placeholder}
      data-focused-advice={placeholder}
      suppressContentEditableWarning
      onInput={handleInput}>
      {value}
    </span>

  )
}
