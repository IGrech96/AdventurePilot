import './App.css'
import Navigator from './navigation/navigator'
import Split from 'react-split';
import { Box, Paper, Typography } from '@mui/material';
import MarkdownEditor from './editor/markdown-editor';
import { useEffect, useState } from 'react';

function App() {
  const [activeMarkdown, setActiveMarkdown] = useState("");

  const onMarkdownOpen = (event: any, content: string) => {
    setActiveMarkdown(content);
  };

  useEffect(() => {
    window.applicationApi.file.subscribe_onMarkdownOpen(onMarkdownOpen);

    return () => {
      window.applicationApi.file.unsubscribe_onMarkdownOpen(onMarkdownOpen);
    }
  }, [onMarkdownOpen]);

  return (
    <>
      <Split
        sizes={[25, 75]} // initial size percentages
        gutterSize={3}
        direction="horizontal"
        style={{ display: 'flex', flex: 1 }}
      >
        {/* Left Pane: Tree */}
        <Box component={Paper} elevation={3} sx={{ display: 'flex', flexDirection: 'column', minWidth: 250, overflow: 'hidden' }}>
          <Navigator />
        </Box>

        {/* Right Pane: Working Area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <MarkdownEditor plainText={activeMarkdown} />
          {/* Your main content goes here */}
        </Box>
      </Split>

    </>
  )
}

export default App
