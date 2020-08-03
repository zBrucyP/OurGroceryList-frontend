import React from 'react';
import './App.css';
import HeadingBar from './components/HeadingBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette:{
    primary: {
      light: '#b2fef7',
      main: '#80cbc4',
      dark: '#4f9a94',
      contrastText: '#000000'
    },
    secondary: {
      light: '#c3fdff',
      main: '#90caf9',
      dark: '#5d99c6',
      contrastText: '#000000'
    },
  }
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <HeadingBar />
      </ThemeProvider>
    </div>
  );
}

export default App;
