import './App.css'
import Navigator from './navigation/navigator'
import Split from 'react-split';
import { Box, Paper, Typography } from '@mui/material';

function App() {

  return (
    <>
    <Split
      sizes={[25, 75]} // initial size percentages
      gutterSize={3}
      direction="horizontal"
      style={{ display: 'flex', flex: 1 }}
    >
      {/* Left Pane: Tree */}
      <Box component={Paper} elevation={3} sx={{ display: 'flex', flexDirection: 'column', minWidth:250, overflow: 'hidden' }}>
       <Navigator/>
      </Box>

      {/* Right Pane: Working Area */}
      <Box sx={{ padding: 2, overflow: 'auto' }}>
        <Typography variant="h6">Working Area</Typography>
        {/* Your main content goes here */}
      </Box>
    </Split>
      
    </>
  )
}

export default App
