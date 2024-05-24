import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from "@emotion/styled";

const Home: React.FC = () => {
    return (
        <StyledContainer>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to My Web3 App
                </Typography>
                <Typography variant="body1">
                    This is a simple example of a React app using Material UI, TypeScript, and Vite.
                </Typography>
            </Box>
        </StyledContainer>
    );
};

const StyledContainer = styled(Container)`
    z-index: 5;
`


export default Home;
