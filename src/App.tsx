import logo from './logo.svg';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/home/HomePage';
import { Header } from './components/Header';
import { ThemeProvider, Button, useTheme } from 'degen';

const App = () => {
  
  return (
  <div className="App">
    <BrowserRouter>
    <Header/>
      <Routes>
          <Route path="/" element={<HomePage />}/>
          {/* <Route path="/" element={<EditPage />}/> */}
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App;
