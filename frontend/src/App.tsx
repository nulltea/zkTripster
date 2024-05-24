import './App.css'

import React from 'react';
import {Outlet} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Box from '@mui/material/Box';

const App: React.FC = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header/>
            <Box component="main" flexGrow={1}>
                <Outlet/>
            </Box>
            <Footer/>
        </Box>
    );
};

export default App;



