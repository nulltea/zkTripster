import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link, {LinkProps} from "@mui/material/Link";
import styled from "@emotion/styled";

const HackerInfo: React.FC = () => {
    return (
        <Container>
            <StyledBox my={4}>
                <StyledButtonLink
                    color="primary"
                    href="https://github.com/nulltea/zkTripster"
                    target="_blank"
                    rel="noopener"
                >
                    View GitHub Repository
                </StyledButtonLink>
                <Typography variant="h4" component="h1" gutterBottom>
                    zkTripster: A Privacy-Focused Travel Platform
                </Typography>
                <Typography variant="body1" paragraph>
                    zkTripster leverages zero-knowledge proofs (ZKPs) and verifiable time-lock encryption to enhance the
                    security and privacy of vulnerability disclosures in the DeFi ecosystem. The platform allows
                    white-hat hackers to prove vulnerabilities without revealing details immediately, ensuring
                    vulnerabilities are responsibly disclosed and patched promptly.
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Key Features
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Verifiable Time-Lock Encryption (TLE):</strong> Guarantees ciphertexts are decryptable only
                    after a specified time.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>zkPoEX (Proof of Exploit):</strong> Enables proof of vulnerabilities without disclosing
                    exploit details.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Coordinated Vulnerability Disclosure (CVD):</strong> Ensures vulnerabilities are disclosed
                    only after they have been patched.
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    How It Works
                </Typography>
                <Typography variant="body1" paragraph>
                    The platform uses ZKPs and TLE to securely and privately manage vulnerability disclosures. White-hat
                    hackers submit proofs of exploits, which are verified without revealing sensitive data. Bounty
                    payments are contingent on the disclosure and subsequent patching of vulnerabilities.
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Potential Impact
                </Typography>
                <Typography variant="body1" paragraph>
                    zkTripster aims to improve the security and reliability of DeFi applications by incentivizing
                    responsible vulnerability disclosures and ensuring timely patches.
                </Typography>
                <Typography variant="body1" paragraph>
                    For more details, check out the{' '}
                    <Link href="https://github.com/nulltea/zkTripster" target="_blank" rel="noopener">
                        zkTripster GitHub repository
                    </Link>.
                </Typography>
            </StyledBox>
        </Container>
    );
};

const StyledButtonLink = styled(Link)<LinkProps>`
    margin-bottom: 20px;
    display: block;
`;

const StyledBox = styled(Box)`
    border: 1px solid white;
    padding: 20px;
    background: rgba(0, 0, 0, 70%);
    margin-top: 40px;
`

export default HackerInfo;
