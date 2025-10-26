import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectDialog } from './create-project-dialog/project-dialog';
import MainPage from './main-page/main-page';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dialog" element={<ProjectDialog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
