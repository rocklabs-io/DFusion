import logo from './logo.svg';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/home/HomePage';
import { EditPage } from './pages/edit';
import { PlazaPage } from './pages/plaza';
import { ContentPage } from './pages/content';
import { Header } from './components/Header';
import { ThemeProvider, Button, useTheme } from 'degen';

const App = () => {
  
  return (
  <div className="App">
    <BrowserRouter>
    <Header/>
      <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/edit" element={<EditPage />}/>
          <Route path="/plaza" element={<PlazaPage />}/>
          <Route path="/entry/:id" element={<ContentPage />}/>
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;
