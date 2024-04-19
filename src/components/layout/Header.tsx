import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import { logoutAPI } from '../../utils/fetchUrls';
import { loadingAtom, snackBarAtom, loginAtom, initLogin } from "../../states/global";
import { useAtom } from "jotai";


interface HeaderProps {
    sections: ReadonlyArray<{
        title: string;
        url: string;
    }>;
    title: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
};

export default function Header(props: HeaderProps) {
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate();
    const { sections, title } = props;

    const [, setLoading] = useAtom(loadingAtom)

    const [, setSnackBar] = useAtom(snackBarAtom)

    const [login, setLogin] = useAtom(loginAtom)


    React.useEffect(() => {
        console.log("login", login)
    }, [login])

    const handleSubmit = async () => {
        setLoading(true)
        const res = await logoutAPI.get()
        console.log(res)
        if (res.Code == 200) {
            setSnackBar({
                message: "登出成功",
                type: "success",
                open: false
            })
            setOpen(false)
            setLogin(initLogin)
            navigate("/")
        } else {
            setSnackBar({
                message: res.Msg,
                type: "error",
                open: false
            })
        }
        setSnackBar(pre => ({
            ...pre,
            open: true
        }))
        setLoading(false)
    }


    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {login?.SessionId ? <div>{login.Email.split("@")[0]}</div> : <Button size="small">White</Button>}
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
                {login?.SessionId ?
                    <Button onClick={() => setOpen(true)} variant="outlined" size="small">
                        Sign Out
                    </Button> : <Link
                        to="/login"
                    >
                        <Button variant="outlined" size="small">
                            Sign In
                        </Button>
                    </Link>}

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
                <Link
                    to={"/manage"}
                >
                    <> BookManage</>
                </Link>
            </Toolbar>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        確定是否要登出
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button color={'error'} onClick={() => handleSubmit()}>確定</Button>
                        <Button onClick={() => setOpen(false)}>取消</Button>
                    </Typography>
                </Box>
            </Modal >
        </React.Fragment >
    );
}