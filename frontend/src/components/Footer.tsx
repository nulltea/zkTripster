import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import styled from "@emotion/styled";

const Footer: React.FC = () => {
    return (
        <StyledBox component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#1976d2' }}>
            <Container maxWidth="sm">
                <Typography variant="body1" color="white" >
                    My sticky footer can be found here.
                </Typography>
            </Container>
        </StyledBox>
    );
};

const StyledBox = styled(Box)`
  background-color: black;
`;

export default Footer;
