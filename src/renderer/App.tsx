import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewProjectDialog } from './create-project-dialog/new-project-dialog';
import MainPage from './main-page/main-page';
import { NewItemDialog } from './new-item-dialog/new-item-dialog';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/new-project-dialog" element={<NewProjectDialog />} />
        <Route path="/new-item-dialog" element={<NewItemDialog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
