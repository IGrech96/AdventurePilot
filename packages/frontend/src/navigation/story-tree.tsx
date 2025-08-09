import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { Box } from '@mui/material';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export default function StoryTree() {
  const initialItems: TreeViewBaseItem[] = [
    { id: "1", label: "Unread" },
    { id: "2", label: "Threads" },
    {
      id: "3",
      label: "Chat Rooms",
      children: [
        { id: "c1", label: "General" },
        { id: "c2", label: "Random" },
        { id: "c3", label: "Open Source Projects" },
      ],
    },
    {
      id: "4",
      label: "Direct Messages",
      children: [
        { id: "d1", label: "Alice" },
        { id: "d2", label: "Bob" },
        { id: "d3", label: "Charlie" },
      ],
    },
  ];

  const [items, setItems] = React.useState<TreeViewBaseItem[]>(initialItems);
  const dragItem = React.useRef<string | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, props: TreeItemProps) => {
    // dragItem.current = id;
  };

  const handleDrop = (event: React.DragEvent<HTMLLIElement>, props: TreeItemProps) => {
    // const draggedId = dragItem.current;
    // if (!draggedId || draggedId === targetId) return;

    // const draggedIndex = items.findIndex((item) => item.id === draggedId);
    // const targetIndex = items.findIndex((item) => item.id === targetId);

    // const reordered = [...items];
    // const [moved] = reordered.splice(draggedIndex, 1);
    // reordered.splice(targetIndex, 0, moved);

    // setItems(reordered);
    // dragItem.current = null;
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    props: TreeItemProps,
    position: "on" | "before" | "after") => {
    event.preventDefault();
    event.stopPropagation();
    console.log(position + " " + props.label)

    if (!event.currentTarget.classList.contains("drag-over")) {
      event.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    event.currentTarget.classList.remove('drag-over');
  }


  const IndentedDiv = ({ treeItemRef, props, position }: { treeItemRef: React.RefObject<HTMLLIElement | null>, props: TreeItemProps, position: "on" | "before" | "after" }) => {
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
    return (
      <div>
        <IndentedDiv
          props={props}
          treeItemRef={treeItemRef}
          position={'before'}
        />

        <TreeItem
          {...props}
          draggable
          onDragStart={(e) => handleDragStart(e, props)}
          onDrop={(e) => handleDrop(e, props)}
          onDragOver={(e) => handleDragOver(e, props, "on")}
          onDragLeave={handleDragLeave}
          ref={treeItemRef}
          slotProps={{
            label: {
              id: `${props.itemId}-label`,
            },
          }}
        />
      </div>
    );
  });

  return (
    <Box sx={{ height: 400, overflow: 'auto' }}>
      <RichTreeView
        items={initialItems}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
