import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { bookType } from '../../types/book';
import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { booksAPI, cartAPI } from '../../utils/fetchUrls'

import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const perPage = 8;
const perRow = 4;

const Index = () => {
  const [bookList, setBookList] = useState<bookType[]>([])
  const [cookies] = useCookies(["user", "user_name"]);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageNumbers, setPageNumbers] = useState<number[]>([])

  const [, setLoading] = useAtom(loadingAtom)

  const [, setSnackBar] = useAtom(snackBarAtom)

  const fetchData = async () => {
    setLoading(true)
    const res = await booksAPI.get()
    if (res.Code == 200) {
      res.Data.length !== 0 && setBookList(res.Data)
      pageNumbersHandle(res.Data)
    } else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    console.log(cookies)
    fetchData()
  }, [cookies])

  const addToCartHandle = async (bookId?: number) => {
    console.log(bookId)
    // 加入購物車
    const res = await cartAPI.getById(bookId!)
    if (res.Code == 200) {
      setSnackBar({
        message: `${res.Data.Title} 圖書成功加入購物車`,
        type: "success",
        open: true
      })
    }
    else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
  }

  const pageNumbersHandle = (list: []) => {
    if (list.length > 0) {
      const totalPage = list.length % perPage == 0 ? Math.floor(list.length / perPage) : Math.floor(list.length / perPage + 1)
      const pages: number[] = []
      for (let i = 0; i < totalPage; i++) {
        pages.push(i + 1)
      }
      setPageNumbers(pages)
    }
  }


  return (
    <div>
      <Grid container spacing={2} columns={perRow}>
        {bookList.slice((currentPage - 1) * perPage, currentPage * perPage).map(book => <Grid key={book.Id} xs={2} sm={1}>
          <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardActionArea>
              <div className='flex justify-center h-40'>
                <CardMedia
                  component="img"
                  image={book.ImgPath ? `${import.meta.env.VITE_API_URL}bookimg/${book.ImgPath}` : `https://source.unsplash.com/200x200/?book&rnd=${book.Id}`}
                  alt={book.Title}
                  sx={{ height: "150px", width: "150px", alignSelf: "center" }}
                />
              </div>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {book.Title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  作者:{book.Author}
                  <br></br>
                  出版年份:{book.Pyear}
                  <br></br>
                  售價:{book.Price}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions >
              {Number(book.Stock) > 10 ? <Button fullWidth onClick={() => addToCartHandle(book.Id)} size="small" color="primary">
                <ShoppingCartIcon />
              </Button> : <Button fullWidth color="warning">已售完</Button>}
            </CardActions>
          </Card>
        </Grid>)}
        <Stack spacing={2}>
          <Pagination count={pageNumbers.length} page={currentPage} onChange={(_, page) => {
            setCurrentPage(page)
          }} />
        </Stack>
      </Grid>
    </div>
  )
}

export default Index