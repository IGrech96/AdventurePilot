import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view';
import type { TreeViewBaseItem, TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { Box } from '@mui/material';
import * as React from 'react';
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { findNode, findPositionInParent, ProjectTreeViewItem, toTree } from './project-tree-item';

type StoryTreeProperties = {

}

export type StoryTreeHandle = {

  createNew: () => void;
}

type dragndropposition = "before" | "on" | "after";

const initialItems: ProjectTreeViewItem[] = toTree(null);

function ProjectTree(properties: StoryTreeProperties, ref: React.Ref<StoryTreeHandle>) {
  const [selectedItem, setSelectedItem] = React.useState<string|null>(null);
  const apiRef = useTreeViewApiRef();

  useImperativeHandle(ref, () => ({
    createNew() {
      //TODO:
      // if (selectedItem) {
      //   const reordered = [...items];

      //   const next = {
      //     id: "7",
      //     label: "New ",
      //   }

      //   if (selectedItem !== "0") {
      //     const [parent, index] = findPositionInParent(reordered, selectedItem);
      //     parent.children![index].children ??= [];
      //     parent.children![index].children.push(next)

      //     apiRef.current?.setItemExpansion({
      //       itemId: parent.children![index].id,
      //       shouldBeExpanded: true
      //     });

      //   }
      //   else {
      //     reordered[0].children ??= [];
      //     reordered[0].children.push(next);
      //     apiRef.current?.setItemExpansion({
      //       itemId: reordered[0].id,
      //       shouldBeExpanded: true
      //     });
      //   }

      //   setItems(reordered);
      //   apiRef.current?.setItemSelection({
      //     itemId: next.id,
      //     shouldBeSelected: true,
      //     keepExistingSelection: false
      //   })
      // }
    },
  }));

  const [items, setItems] = React.useState<ProjectTreeViewItem[]>(initialItems);
  const dragItem = React.useRef<TreeItemProps | null>(null);



  useEffect(() => {
    const onProjectOpen = (event: any, data: ProjectConfiguration) => {
      setItems(toTree(data));
    }
    window.applicationApi.project.subscribe_onProjectOpen(onProjectOpen);

    return () => {
      window.applicationApi.project.unsubscribe_onProjectOpen(onProjectOpen);
    }
  }, []);

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, props: TreeItemProps) => {
    dragItem.current = props;
    // event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, props: TreeItemProps, position: dragndropposition) => {
    event.currentTarget.classList.remove('drag-over');

    const draggedProps = dragItem.current;
    dragItem.current = null;

    if (!draggedProps || draggedProps.itemId === props.itemId) return;

    const reordered = [...items];

    const [draggedParent, draggedIndex] = findPositionInParent(reordered, draggedProps.itemId)
    const [targetParent, targetIndex] = findPositionInParent(reordered, props.itemId)


    const movableItem = draggedParent.children![draggedIndex];


    if (position == "on") {
      //draggable item should be the child
      targetParent.children![targetIndex].children ??= [];
      targetParent.children![targetIndex].children.push(movableItem)
      draggedParent.children?.splice(draggedIndex, 1)
    }
    else {
      const newIndex = position == "after" ? targetIndex + 1 : targetIndex
      if (targetParent.id == draggedParent.id && draggedIndex > newIndex) {
        draggedParent.children?.splice(draggedIndex, 1)
      }

      targetParent.children = [
        ...targetParent.children!.slice(0, newIndex),
        movableItem,
        ...targetParent.children!.slice(newIndex),
      ]

      if (targetParent.id != draggedParent.id || draggedIndex < newIndex) {
        draggedParent.children?.splice(draggedIndex, 1)
      }
    }
    setItems(reordered);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    props: TreeItemProps,
    position: dragndropposition) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log(position + " " + props.label)

    if (!event.currentTarget.classList.contains("drag-over")) {
      event.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.currentTarget.classList.remove('drag-over');
  }

  const handleDragEnd = (event: React.DragEvent<HTMLElement>) => {
    dragItem.current = null;
  }

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent<Element, Event> | null,
    id: string | null,
  ) => {
    if (id)
      setSelectedItem(id);
  };

  const handleItemClicked = (vent: React.MouseEvent, itemId: string) => {
    const node = findNode(items, itemId);
    window.applicationApi.project.sendProjectItemClicked(node);
  }

  const IndentedDiv = ({ treeItemRef, props, position }: { treeItemRef: React.RefObject<HTMLLIElement | null>, props: TreeItemProps, position: dragndropposition }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [marginLeft, setMarginLeft] = useState<string>('0px');

    useEffect(() => {
      if (treeItemRef && treeItemRef.current) {
        const indent = treeItemRef.current.style.getPropertyValue("--TreeView-itemDepth") || '0'
        const margin = +indent * 25;
        setMarginLeft(`${margin}px`);
      }
    }, [treeItemRef]);

    return (
      <div
        ref={divRef}
        onDrop={(e) => handleDrop(e, props, position)}
        onDragOver={(e) => handleDragOver(e, props, position)}
        onDragLeave={handleDragLeave}
        style={{
          marginLeft: marginLeft,
          height: 3,
          display: 'block',
        }}
      />
    );
  };

  const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: TreeItemProps,
    ref: React.Ref<HTMLLIElement>,
  ) {
    const treeItemRef = useRef<HTMLLIElement>(null);
    const node = props.itemId ? findNode(items, props.itemId) : null;
    const canDrag = node != null && node.type != 'reserved';
    props.itemId != "0";
    if (!canDrag) {
      return (
        <TreeItem
          {...props}
          ref={treeItemRef}
          slotProps={{
            label: {
              id: `${props.itemId}-label`,
            },
          }}
        />
      );
    }
    return (
      <div>
        <IndentedDiv
          props={props}
          treeItemRef={treeItemRef}
          position={'before'}
        />

        <TreeItem
          {...props}
          draggable={canDrag}
          onDragStart={(e) => handleDragStart(e, props)}
          onDrop={(e) => handleDrop(e, props, "on")}
          onDragOver={(e) => handleDragOver(e, props, "on")}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          ref={treeItemRef}
          slotProps={{
            label: {
              id: `${props.itemId}-label`,
            },
          }}
        />

        <IndentedDiv
          props={props}
          treeItemRef={treeItemRef}
          position={'after'}
        />
      </div>
    );
  });

  return (
    <Box sx={{ overflow: 'auto' }}>
      <RichTreeView
        apiRef={apiRef}
        items={items}
        slots={{ item: CustomTreeItem }}
        selectedItems={selectedItem}
        onItemClick={handleItemClicked}
        onSelectedItemsChange={handleSelectedItemsChange}
        expansionTrigger="iconContainer"
      />
    </Box>
  );
}

export default forwardRef<StoryTreeHandle, StoryTreeProperties>(ProjectTree);
