import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link, {LinkProps} from '@mui/material/Link';
import styled from '@emotion/styled'

const Header: React.FC = () => {
    return (
        <StyledAppBar position="static" sx={{ width: '100%' }} >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Web3 App
                </Typography>
                <StyledLink component={RouterLink} to="/" color="inherit" underline="none" sx={{ marginRight: 2 }}>
                    Home
                </StyledLink>
                <StyledLink component={RouterLink} to="/submit" color="inherit" underline="none" sx={{ marginRight: 2 }}>
                    Submit Form
                </StyledLink>
                <StyledLink component={RouterLink} to="/validate" color="inherit" underline="none">
                    Validate Proof
                </StyledLink>
            </Toolbar>
        </StyledAppBar>
    );
};


const StyledAppBar = styled(AppBar)`
    background-color: black;
    background-image: none;
`;

const StyledLink = styled(Link)<LinkProps & { component: React.ElementType, to?: string }>`
    color: white;
    text-transform: uppercase;
`;

export default Header;

