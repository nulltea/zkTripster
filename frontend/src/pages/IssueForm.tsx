import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styled from "@emotion/styled";
import {formatEthAmount} from "../utils.ts";

const IssueForm: React.FC = () => {
    const [callData, setCallData] = useState<string>('');
    const [bountyAmount, setBountyAmount] = useState<string>('');

    const handleBountyAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatEthAmount(event.target.value);
        setBountyAmount(formattedValue);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    };

    return (
        <Container>
            <StyledBox my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Receive the vulnerability report
                </Typography>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <TextField
                        label="Call Data"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setCallData(e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Bounty Amount (ETH)"
                        variant="outlined"
                        fullWidth
                        value={bountyAmount}
                        onChange={handleBountyAmountChange}
                        margin="normal"
                    />
                    <StyledButtonWrapper>
                        <Button type="submit" disabled={!(bountyAmount.length && callData.length)} variant="contained"
                                size="large" color="primary">
                            Generate Proof
                        </Button>
                    </StyledButtonWrapper>
                </form>
            </StyledBox>
        </Container>
    );
};

const StyledBox = styled(Box)`
    border: 1px solid white;
    padding: 20px;
    background: rgba(0, 0, 0, 70%);
    margin-top: 40px;
`

const StyledButtonWrapper = styled('div')`
    width: 100%;
    text-align: right;
`

export default IssueForm;
