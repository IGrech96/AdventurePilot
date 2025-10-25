import { ModelStore } from "./use-model-store";
import './list-editable.css'
import { useState, MouseEvent } from "react";
import TextEditable from "./text-editable";
import { Button } from '@/components/tiptap-ui-primitive/button';
import DeleteIcon from '@mui/icons-material/Delete';
import { StoreApi, UseBoundStore, useStore } from "zustand";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';


export type ListEditableItem<TItem> = {
  path: (model: TItem) => any;
  type: "text" | "quantity" | "separator"
}

export type ListEditableProperties<T, TItem> = {
  store: UseBoundStore<StoreApi<ModelStore<T>>>;
  path: (model: T) => TItem[] | undefined
  editable?: boolean;
  label: string;
  itemTemplate: ListEditableItem<TItem>[];
}

export default function ListEditable<T, TItem extends object>(props: ListEditableProperties<T, TItem>) {

  const items = useStore(props.store, (state) => state.getValue(props.path));

  const template = props.itemTemplate;
  const handleNewItem = (event: MouseEvent<HTMLButtonElement>) => {
    const copy = [...items];
    copy.push({})

    props.store.getState().updateModel(props.path, copy);
  }

  return (
    <>
      <h3 className="list-editable-item">{props.label}{props.editable && <Button
        className="list-editable-item-delete-button"
        type="button"
        data-style="ghost"
        data-active-state="off"
        role="button"
        tabIndex={-1}
        aria-label="add new"
        // aria-pressed={isActive}
        tooltip="Add New"
        onClick={handleNewItem}
      >
        <AddOutlinedIcon className='tiptap-button-icon' />
      </Button>}</h3>
      <ul>
        {
          items.map((item: TItem, index: number) => {
            const localIndex = index;
            const handleDeleteItem = (event: MouseEvent<HTMLButtonElement>) => {
              const copy = [...items];
              copy.splice(localIndex, 1);

              props.store.getState().updateModel(props.path, copy);
            }


            const values = template.map((tmp, tmpIndex) => {
              if (tmp.type == "quantity") {
                return <span key={props.label + index + tmpIndex}> (x<TextEditable
                  editable={props.editable}
                  store={props.store}
                  path={combinePath(props.path, localIndex, tmp.path)}
                  defaultValue={1}
                />)
                </span>
              } else if (tmp.type == "text") {
                return <TextEditable
                  key={props.label + index + tmpIndex}
                  editable={props.editable}
                  store={props.store}
                  path={combinePath(props.path, localIndex, tmp.path)}
                />
              } else if (tmp.type == "separator") {
                return <span key={props.label + index + tmpIndex}>: </span>
              }
            })
            return (
              <li className="list-editable-item" key={props.label + index}>
                <div>{values}</div>{props.editable && <Button
                  className="list-editable-item-delete-button"
                  type="button"
                  data-style="ghost"
                  data-active-state="off"
                  role="button"
                  tabIndex={-1}
                  aria-label="delete"
                  // aria-pressed={isActive}
                  tooltip="Delete"
                  onClick={handleDeleteItem}
                >
                  <DeleteIcon className='tiptap-button-icon' />
                </Button>}
              </li>
            );
          })
        }
      </ul>
    </>
  )
}

function combinePath<T, TItem>(mainPath: (model: T) => TItem[] | undefined, index: number, itemPath: (model: TItem) => any): (model: T) => any {
  return (model: T) => {
    const x = mainPath(model);
    if (x) {
      itemPath(x[index]);
    }
  }
}
