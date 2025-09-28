import * as React from 'react';
// import IconButton from '@mui/material/IconButton';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import './navigation-toobar.css'
import { Icon, rgbToHex, SvgIcon } from '@mui/material';
import { Button } from '@/components/tiptap-ui-primitive/button';
// import { ToggleButton } from '@/components/tiptap-ui-primitive';
import { Toolbar } from '@/components/tiptap-ui-primitive/toolbar';
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button';
import { ThemeToggle } from '@/components/tiptap-templates/simple/theme-toggle';
import { ModeToggle } from './mode-toggle/mode-toggle';
// import '@/components/tiptap-ui-primitive/button/button.scss';

type NavigationToolbarProps = {
  onCreateNew: (event: React.MouseEvent<HTMLButtonElement>) => void;
  save: (event: React.MouseEvent<HTMLButtonElement>) => void;

  canCreate: boolean;
  canSave: boolean;
};

export default function NavigationToolbar(properties: NavigationToolbarProps) {
  return (
    <Toolbar className='toolbar'>
      <div className='toolbar-common'>
        <ThemeToggle defaultTheme="light" />
        <ModeToggle defaultMode='edit' />
      </div>
      <div className='toolbar-project'>
        <Button
          type="button"
          data-style="ghost"
          data-active-state="off"
          role="button"
          tabIndex={-1}
          disabled={!properties.canCreate}
          data-disabled={!properties.canCreate}
          aria-label="create new"
          // aria-pressed={isActive}
          tooltip="Create new"
          onClick={properties.onCreateNew}
        >
          <AddOutlinedIcon className='tiptap-button-icon' />
        </Button>
        <Button
          type="button"
          data-style="ghost"
          data-active-state="off"
          role="button"
          tabIndex={-1}
          disabled={!properties.canSave}
          data-disabled={!properties.canSave}
          aria-label="Save"
          tooltip="Save"
          onClick={properties.save}
        >
          <SvgIcon component={SaveIcon} className='tiptap-button-icon' />
        </Button>
      </div>
    </Toolbar>
    //   ref={toolbarRef}
    //   style={{
    //     ...(isMobile
    //       ? {
    //         bottom: `calc(100% - ${height - rect.y}px)`,
    //       }
    //       : {}),
    //   }}
    // >
    //   {mobileView === "main" ? (
    //     <MainToolbarContent
    //       onHighlighterClick={() => setMobileView("highlighter")}
    //       onLinkClick={() => setMobileView("link")}
    //       isMobile={isMobile}
    //     />
    //   ) : (
    //     <MobileToolbarContent
    //       type={mobileView === "highlighter" ? "highlighter" : "link"}
    //       onBack={() => setMobileView("main")}
    //     />
    //   )}
    // <div className="toolbar">


    // </div>
  );
}
