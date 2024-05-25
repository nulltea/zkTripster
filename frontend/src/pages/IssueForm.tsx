import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styled from "@emotion/styled";
import {useParams} from "react-router-dom";
import {verifyZkPoex, formatEthAmount, fetchContractData} from "../utils";

const IssueForm: React.FC = () => {
    const {contract_address} = useParams<{ contract_address: string }>();
    const [callData, setCallData] = useState<string>('');
    const [bountyAmount, setBountyAmount] = useState<string>('');
    const [zkPoex, setZkPoex] = useState('')
    const [enc, setEnc] = useState('')
    const [verificationResult, setVerificationResult] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (contract_address) {
                try {
                    const data = await fetchContractData(contract_address);
                    setZkPoex(data.zkPoex);
                    setEnc(data.Enc);
                } catch (error) {
                    console.error('Error fetching contract data:', error);
                }
            }
        };
        void fetchData();
    }, [contract_address]);

    useEffect(() => {
        if (zkPoex && enc) {
            if (verifyZkPoex()) {
                setVerificationResult('Valid proof');
            } else {
                setVerificationResult('Invalid proof');
            }
        }
    }, [zkPoex, enc]);

    const handleBountyAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatEthAmount(event.target.value);
        setBountyAmount(formattedValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Contract Address:', contract_address);
        console.log('Call Data:', callData);
        console.log('Bounty Amount:', bountyAmount);
    };

    console.log(contract_address);

    return (
        <Container>
            <StyledBox my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Receive the vulnerability report
                </Typography>
                {verificationResult && (
                    <VerificationResultBox isValid={verificationResult === 'Valid proof'}>
                        <Typography variant="h6">{verificationResult}</Typography>
                    </VerificationResultBox>
                )}
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

const VerificationResultBox = styled(Box)<{ isValid: boolean }>`
    margin-top: 20px;
    padding: 10px;
    border: 1px solid ${props => (props.isValid ? 'green' : 'red')};
    background-color: ${props => (props.isValid ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)')};
`;

export default IssueForm;
