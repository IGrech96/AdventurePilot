"use client"

import * as React from "react"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"

// --- Icons ---
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export function ModeToggle({defaultMode}:{defaultMode?: "edit" | "presentation" | undefined}) {
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false)

  // React.useEffect(() => {
  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  //   const isEditMode = !defaultMode ? mediaQuery.matches : (defaultMode == "edit");
  //   const handleChange = () => setIsEditMode(isEditMode)
  //   mediaQuery.addEventListener("change", handleChange)
  //   return () => mediaQuery.removeEventListener("change", handleChange)
  // }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("edit", isEditMode)
  }, [isEditMode])

  const toggleEditMode = () => setIsEditMode((isEdit) => !isEdit)

  return (
    <Button
      onClick={toggleEditMode}
      aria-label={`Switch to ${isEditMode ? "presentation" : "edit"} mode`}
      data-style="ghost"
    >
      {isEditMode ? (
        <ModeEditIcon className="tiptap-button-icon" />
      ) : (
        <TheaterComedyIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
