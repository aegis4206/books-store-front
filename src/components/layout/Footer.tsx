import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://aegis4206.tplinkdns.com:8080/">
                white
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

interface FooterProps {
    title: string;
}

export default function Footer(props: FooterProps) {
    const { title } = props;

    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h6" align="center" gutterBottom>
                    {title}
                </Typography>
                <Copyright />
            </Container>
        </Box>
    );
}