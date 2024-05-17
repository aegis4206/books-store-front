import { useEffect } from 'react';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/login';
import Index from './components/pages';
import Bookmanage from './components/pages/bookmanage';
import Cart from './components/pages/cart';
import "./App.css"
import Orders from './components/pages/orders';
import Ordermanage from './components/pages/ordermanage';



import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, loginAtom } from "./states/global";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

const sections = [
  { title: 'Book', url: '/' },
  { title: 'Cart', url: '/cart' },
  { title: 'Order', url: '/orders' },
  { title: 'BookManage', url: '/bmanage' },
  { title: 'OrderManage', url: '/omanage' },

];

function App() {
  const [loading,] = useAtom(loadingAtom)

  const [snackBar, setSnackBar] = useAtom(snackBarAtom)
  const [login, setLogin] = useAtom(loginAtom)

  const [cookies] = useCookies(["SessionId", "Email", "Id"]);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (cookies.SessionId != login.SessionId) {
      const loginInfo = {
        Email: cookies.Email,
        Id: cookies.Id,
        SessionId: cookies.SessionId,
      }
      setLogin(loginInfo)
      console.log(loginInfo)
    }
  }, [])

  useEffect(() => {
    // console.log("path",location.pathname)
    // console.log("cookie",cookies.SessionId)
    if (!cookies.SessionId && (location.pathname == "/bmanage" || location.pathname == "/omanage" || location.pathname == "/orders")) {
      navigate("/login")
    } else if (cookies.SessionId && location.pathname == "/login") {
      navigate("/")
    }

  }, [location.pathname, cookies.SessionId])

  return (
    <>
      <Container maxWidth="lg">
        <Header title="Books Store" sections={sections}></Header>
        <Grid>
          <Routes>
            <Route path="/" element={<Index />} />
            {!cookies.SessionId && <Route path="/login" element={<Login />} />}
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/bmanage" element={<Bookmanage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/omanage" element={<Ordermanage />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>

        </Grid>
        <Grid >
        </Grid>
      </Container>
      <Footer
        title="White's books store"
      ></Footer>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={5000}
        onClose={() => setSnackBar(pre => ({ ...pre, open: false }))}
      >
        <Alert
          onClose={() => setSnackBar(pre => ({ ...pre, open: false }))}
          severity={snackBar.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
