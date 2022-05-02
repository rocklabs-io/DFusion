import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Provider as ReduxProvider } from 'react-redux';
import { HomePage } from './pages/home/HomePage';
import { EditPage } from './pages/edit';
import { PlazaPage } from './pages/plaza';
import { SettingPage } from './pages/setting';
import { ProfilePage } from './pages/profile';
import { ContentPage } from './pages/content';
import { store } from 'src/store';
import { Header } from './components/header';
import "@fontsource/roboto"
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

declare global {
  interface Window { ic: any; }
}
global.Buffer = global.Buffer || require('buffer').Buffer;

const App = () => {
  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          borderRadius: '16px',
          _focus: {
            boxShadow: 'none'
          }
        },
      }
    },
    fonts: {
      header: 'Roboto',
      body: 'Roboto'
    },
    colors: {
      regular: {
        100: '#ECF1FF',
        200: '#ECF1FF',
        300: '#ECF1FF',
        400: '#2663FF', // solid
        500: '#2663FF', // solid
        600: '#1C4FE8', // outline 
      },
      grey: {
        400: '#E6E6E6',
        300: '#C4C4C4',
        200: '#666666',
        100: '#000000'
      }
    },
    styles: {
      global: {
        h1: {
          fontSize: '48px',
          fontWeight: 'bolder',
          margin: '10px'
        },
        h2: {
          fontSize: '36px',
          margin: '10px'
        },
        h3: {
          fontSize: '3xl',
        },
        h4: {
          fontSize: '2xl',
        },
        p: {
          fontSize: '1xl'
        }
      }
    }
  })

  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <ReduxProvider store={store} >
          <BrowserRouter>
            <Header />
            <div style={{ width: "100%", height: "60px" }}></div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/plaza" element={<PlazaPage />} />
              <Route path="/profile/:pid" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/setting" element={<SettingPage />} />
              <Route path="/entry/:id" element={<ContentPage />} />
            </Routes>
          </BrowserRouter>
        </ReduxProvider>
      </ChakraProvider>
    </div>
  )
}

export default App;
