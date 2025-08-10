import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import './navigation.css'

type NavigationToolbarProps = {
  onCreateNew: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function NavigationToolbar(properties: NavigationToolbarProps) {

  return (
    <div className="toolbar">
      <IconButton
        size="small"
        aria-label="create new"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={properties.onCreateNew}
        color="inherit"
      >
        <NoteAddIcon />
      </IconButton>
    </div>
  );
}
