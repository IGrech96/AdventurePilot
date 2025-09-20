import './App.css'
import Navigator from './navigation/navigator'
import Split from 'react-split';
import { Box, Paper, Typography } from '@mui/material';
import MarkdownEditor from './editor/markdown-editor/markdown-editor';
import { useEffect, useState } from 'react';
import DnDCharacterSheet from './editor/dnd-character-sheet/dnd-character-sheet';

type editorType = 'markdown' | 'character' | 'none'

function App() {

  const getType = (def: IDefinition | undefined): editorType => {
    if (!def) return 'none';
    if (def.type == 'npc') return 'character';

    return 'markdown';
  }

  const getMarkdownContent = (def: IDefinition | undefined): SceneDefinition | OverviewDefinition | CommonDefinition | undefined => {
    if (getType(def) == 'markdown') {
      return def as any;
    }
    return undefined;
  }

  const [activeDefinition, setActiveDefinition] = useState<{
    content?: string;
    node: IDefinition;
  } | null>(null);

  const onDefinitionOpen = (event: any, content: string | null, node: IDefinition) => {
    setActiveDefinition({ content: content ?? undefined, node: node });
  };

  useEffect(() => {
    window.applicationApi.file.subscribe_ondefinitionOpen(onDefinitionOpen);

    return () => {
      window.applicationApi.file.unsubscribe_ondefinitionOpen(onDefinitionOpen);
    }
  }, [onDefinitionOpen]);

  return (
    <>
      <Split
        sizes={[25, 75]} // initial size percentages
        gutterSize={3}
        direction="horizontal"
        style={{ display: 'flex', flex: 1 }}
      >
        {/* Left Pane: Tree */}
        <Box component={Paper} elevation={3} sx={{ display: 'flex', flexDirection: 'column', minWidth: 250, overflow: 'auto' }}>
          <Navigator />
        </Box>

        {/* Right Pane: Working Area */}
        <Box component={Paper} elevation={3} sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          { getType(activeDefinition?.node) == 'markdown' && <MarkdownEditor plainText={activeDefinition?.content} node={getMarkdownContent(activeDefinition?.node)} />}
          { getType(activeDefinition?.node) == 'character' && <DnDCharacterSheet /> }
        </Box>
      </Split>

    </>
  )
}

export default App
