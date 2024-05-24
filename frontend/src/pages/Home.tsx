import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to My Web3 App
                </Typography>
                <Typography variant="body1">
                    This is a simple example of a React app using Material UI, TypeScript, and Vite.
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
