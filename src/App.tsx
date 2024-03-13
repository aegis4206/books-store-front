import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/login';
import Index from './components/pages';
import "./App.css"

import { useAtom } from "jotai";
import { loadingAtom } from "./states/loading";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const sections = [
  { title: 'one', url: '#' },
  { title: 'two', url: '#' },
  { title: 'three', url: '#' },
  { title: 'ShopCart', url: '#' },

];

function App() {
  const [loading,] = useAtom(loadingAtom)


  return (
    <>
      <Container maxWidth="lg">
        <Header title="Books Store" sections={sections}></Header>
        <Grid>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
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
    </>
  )
}

export default App
