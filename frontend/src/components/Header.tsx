import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const Header: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Web3 App
                </Typography>
                <Link component={RouterLink} to="/" color="inherit" underline="none" sx={{ marginRight: 2 }}>
                    Home
                </Link>
                <Link component={RouterLink} to="/submit" color="inherit" underline="none" sx={{ marginRight: 2 }}>
                    Submit Form
                </Link>
                <Link component={RouterLink} to="/validate" color="inherit" underline="none">
                    Validate Proof
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
