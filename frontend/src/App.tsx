import './App.css'
import React from 'react';
import {Outlet} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Box from '@mui/material/Box';
import CircleAnimation from "./components/CircleAnimation.tsx";
import styled from "@emotion/styled";

const App: React.FC = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" style={{ position: 'relative'}}>
            <StyledAnimationContainer>
                <StyledContainer>
                    <CircleAnimation />
                </StyledContainer>
            </StyledAnimationContainer>
            <Header />
            <Box component="main" flexGrow={1}>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
};

const StyledAnimationContainer = styled('div')`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: auto;
    z-index: 2;
    display: block;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    perspective: 1000px;
`

const StyledContainer = styled('div')`
    position: absolute;
    left: -72%;
    top: -46%;
    right: auto;
    z-index: -2;
    display: block;
    filter: saturate(135%);
`

export default App;



