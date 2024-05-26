import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {CssBaseline} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {router} from './router.tsx';

// #D63A2B - red
// #01518B - blue
// #1AA52C - green

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#01518B',
        },
        secondary: {
            main: '#D63A2B',
        },
    },
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);

