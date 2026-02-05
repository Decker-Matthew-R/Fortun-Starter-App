import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import darkTheme from './themes/darkTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline enableColorScheme />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
