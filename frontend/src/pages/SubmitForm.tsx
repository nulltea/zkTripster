import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SubmitForm: React.FC = () => {
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Submit Form
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        label="Input"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary">
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SubmitForm;
