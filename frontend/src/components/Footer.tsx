import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#1976d2' }}>
            <Container maxWidth="sm">
                <Typography variant="body1" color="white">
                    My sticky footer can be found here.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
