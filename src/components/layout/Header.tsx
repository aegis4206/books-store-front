import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';


interface HeaderProps {
    sections: ReadonlyArray<{
        title: string;
        url: string;
    }>;
    title: string;
}

export default function Header(props: HeaderProps) {
    const { sections, title } = props;

    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Button size="small">White</Button>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                    <Link
                        to="/"
                        className='no-underline text-black'
                    >
                        {title}
                    </Link>

                </Typography>
                <IconButton >
                    <SearchIcon />
                </IconButton>
                <Link
                    to="/login"
                >
                    <Button variant="outlined" size="small">
                        Sign in
                    </Button>
                </Link>

            </Toolbar>
            <Toolbar
                component="nav"
                variant="dense"
                sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
            >
                {sections.map((section) => (
                    <Link
                        key={section.title}
                        to={section.url}
                    >
                        <> {section.title}</>
                    </Link>
                ))}
            </Toolbar>
        </React.Fragment>
    );
}