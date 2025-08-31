import React, { forwardRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { Button, Menu, MenuItem, IconButton, Tooltip, Popover, Box } from '@mui/material'
import TableChartIcon from '@mui/icons-material/TableChart'
import AddRowIcon from '@mui/icons-material/Add'
import DeleteRowIcon from '@mui/icons-material/Remove'
import GridOnIcon from '@mui/icons-material/GridOn'
import { useTiptapEditor } from '@/hooks/use-tiptap-editor'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { findNodePosition, isValidPosition } from '@/lib/tiptap-utils'

import './table.css'

type TableToolbarProps = { editor?: Editor | null }

export const TableToolbar = forwardRef<HTMLDivElement, TableToolbarProps>(
  (
    {
      editor: providedEditor,
      // action,
      // text,
      // hideWhenUnavailable = false,
      // onExecuted,
      // showShortcut = false,
      // onClick,
      // children,
      // ...buttonProps
    },
    ref
  ) => {
    // React.FC<Props> = ({ editor }) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedSize, setSelectedSize] = useState<[number, number]>([3, 3])

    const open = Boolean(anchorEl)

    const focus = (): boolean => {
      try {
        if (!editor) return false;
        const view = editor.view
        let state = view.state
        let tr = state.tr

        // No selection, find the the cursor position
        if (state.selection.empty || state.selection instanceof TextSelection) {
          const pos = findNodePosition({
            editor,
            node: state.selection.$anchor.node(1),
          })?.pos
          if (!isValidPosition(pos)) return false

          tr = tr.setSelection(NodeSelection.create(state.doc, pos))
          view.dispatch(tr)
          state = view.state
        }

        const selection = state.selection

        let chain = editor.chain().focus()

        // Handle NodeSelection
        if (selection instanceof NodeSelection) {
          const firstChild = selection.node.firstChild?.firstChild
          const lastChild = selection.node.lastChild?.lastChild

          const from = firstChild
            ? selection.from + firstChild.nodeSize
            : selection.from + 1

          const to = lastChild
            ? selection.to - lastChild.nodeSize
            : selection.to - 1

          chain = chain.setTextSelection({ from, to }).clearNodes()
        }

        // if (editor.isActive(type)) {
        //   // Unwrap list
        //   chain
        //     .liftListItem("listItem")
        //     .lift("bulletList")
        //     .lift("orderedList")
        //     .lift("taskList")
        //     .run()
        // } else {
        //   // Wrap in specific list type
        //   const toggleMap: Record<ListType, () => typeof chain> = {
        //     bulletList: () => chain.toggleBulletList(),
        //     orderedList: () => chain.toggleOrderedList(),
        //     taskList: () => chain.toggleList("taskList", "taskItem"),
        //   }

        //   const toggle = toggleMap[type]
        //   if (!toggle) return false

        //   toggle().run()
        // }

        // editor.chain().focus().selectTextblockEnd().run()

        return true
      }
      catch {
        return false;
      }
    };

    const handleInsertTable = () => {

      if (!focus()) return;

      editor?.chain().focus().insertTable({
        rows: selectedSize[0],
        cols: selectedSize[1],
        withHeaderRow: true,
      }).run()
      setAnchorEl(null)
      setSelectedSize([0, 0])
    }

    const maxRows = 5;
    const maxCols = 5;

    const isInTable = (): Boolean => {
      if (!editor) return false;
      return editor.isActive('table');
    }

    return (
      <>
        <div style={{ display: 'flex' }}>
          {/* Insert Table Dropdown */}
          {!isInTable() && <Tooltip title="Insert Table">
            <IconButton
              type="button"
              data-style="ghost"
              data-active-state="off"
              disabled={editor?.isActive('table') ?? true}
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              <TableChartIcon />
            </IconButton>
          </Tooltip>}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box p={2}>
              <Box display="grid" gridTemplateColumns={`repeat(${maxCols}, 20px)`} gap={1}>
                {Array.from({ length: maxRows }).map((_, row) =>
                  Array.from({ length: maxCols }).map((_, col) => {
                    const isActive = row < selectedSize[0] && col < selectedSize[1]
                    return (
                      <Box
                        key={`${row}-${col}`}
                        width={24}
                        height={24}
                        bgcolor={isActive ? 'primary.main' : 'grey.300'}
                        onMouseEnter={() => setSelectedSize([row + 1, col + 1])}
                        onClick={() => handleInsertTable()}
                        sx={{ cursor: 'pointer', borderRadius: 1 }}
                      />
                    )
                  })
                )}
              </Box>
              <Box mt={1} textAlign="center" fontSize={12}>
                {selectedSize[0] > 0 && selectedSize[1] > 0
                  ? `${selectedSize[0]} x ${selectedSize[1]}`
                  : 'Select size'}
              </Box>
            </Box>
          </Popover>

          {isInTable() && <div>
            <Tooltip title="Add Row Below">
              <IconButton onClick={() => editor?.chain().focus().addRowAfter().run()}>
                <AddRowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Column After">
              <IconButton onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                <AddRowIcon style={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Row">
              <IconButton onClick={() => editor?.chain().focus().deleteRow().run()}>
                <DeleteRowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Column">
              <IconButton onClick={() => editor?.chain().focus().deleteColumn().run()}>
                <DeleteRowIcon style={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Table">
              <IconButton onClick={() => editor?.chain().focus().deleteTable().run()}>
                <GridOnIcon />
              </IconButton>
            </Tooltip>
          </div>
          }
        </div>
      </>
    )
  }
)
