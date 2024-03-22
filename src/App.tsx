import React from 'react';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/login';
import Index from './components/pages';
import Bookmanage from './components/pages/bookmanage';
import "./App.css"

import { useAtom } from "jotai";
import { loadingAtom, snackBarOpenAtom, snackBarMessageAtom, snackBarTypeAtom } from "./states/global";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const sections = [
  { title: 'one', url: '#' },
  { title: 'two', url: '#' },
  { title: 'ShopCart', url: '#' },
  // { title: 'dropmenu', url: '#' },

];

function App() {
  const [loading,] = useAtom(loadingAtom)
  const [snackBarOpen, setSnackBarOpen] = useAtom(snackBarOpenAtom)
  const [snackBarMessage,] = useAtom(snackBarMessageAtom)
  const [snackBarType,] = useAtom(snackBarTypeAtom)



  return (
    <>
      <Container maxWidth="lg">
        <Header title="Books Store" sections={sections}></Header>
        <Grid>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/manage" element={<Bookmanage />} />

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
        open={snackBarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackBarOpen(false)}
      >
        <Alert
          onClose={() => setSnackBarOpen(false)}
          severity={snackBarType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default App
