import { useState, useEffect } from 'react'
// import { bookType } from '../../types/book';
import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { cartAPI, checkoutAPI } from '../../utils/fetchUrls'
import { cartListType } from '../../types/cart';
import Tables from '../tables'

import { checkboxSelectedAtom } from '../../states/table';
import { GridColDef } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, Chip, Container, Switch, FormControlLabel, Badge, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import ItemList from '../cart/ItemList';

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

const tableColumns = [
  { field: 'Title', headerName: '書名', width: 150 },
  { field: 'Author', headerName: '作者', width: 150 },
  { field: 'Pyear', headerName: '出版年份', width: 100 },
  { field: 'Price', headerName: '價格', width: 80 },
]

const Cart = () => {
  const [cartList, setCartList] = useState<cartListType[]>([])
  const [columns, setColumns] = useState<GridColDef[]>([])
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<cartListType>()


  const [, setLoading] = useAtom(loadingAtom)

  const [, setSnackBar] = useAtom(snackBarAtom)

  const [checkboxSelected, setCheckboxSelected] = useAtom(checkboxSelectedAtom)

  const [listMode, setListMode] = useState(false)


  //MUI無法在renderCell內使用原list
  // let tempList: cartListType[] = []

  const fetchData = async () => {
    setLoading(true)
    const res = await cartAPI.get()
    if (res.Code == 200) {
      const filterStockLiimit = res.Data.filter(item => Number(item.Book.Stock) > 10)
      // console.log("filterStockLiimit", filterStockLiimit)
      setCartList(filterStockLiimit)
      
      // tempList = res.Data
    } else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
    setLoading(false)
  }

  const countChangeHandle = async (count: number, cartItemId: number | string) => {
    if (count == 0) return setSnackBar({
      message: "數量不能少於1",
      type: "warning",
      open: true
    });
    setLoading(true);

    const res = await cartAPI.patch(cartItemId, {
      count,
    });
    console.log(res)
    if (res.Code == 200) {
      setSnackBar({
        message: `書籍數量更新成功`,
        type: "success",
        open: true
      })
      fetchData()
    } else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
    setLoading(false)
    // const index = tempList.findIndex(item => item.CartItemId == id)
    // const newCartList = [...tempList]
    // newCartList[index].Count = count.toString()
    // setCartList(newCartList)
  }

  useEffect(() => {
    fetchData()
    const columnsInit: GridColDef[] = [
      ...tableColumns.map(column => ({
        field: column.field, headerName: column.headerName,
        minWidth: column.width,
        renderCell: (param) => (
          <>
            {param.row.Book[column.field]}
          </>
        ),
      })),
      {
        field: 'Count', headerName: '數量',
        width: 180,
        renderCell: (param) => (
          <>
            <Button onClick={(event) => {
              event.stopPropagation();
              countChangeHandle(Number(param.row.Count) - 1, param.id)
            }
            }>-</Button>
            {param.row.Count}
            < Button onClick={(event) => {
              event.stopPropagation();
              countChangeHandle(Number(param.row.Count) + 1, param.id)
            }
            }
            > +</Button >
          </>
        ),
      },
      {
        field: 'Amount', headerName: '總價',
        renderCell: (param) => (
          <>
            {/* {param.row.Count * param.row.Book.Price} */}
            {param.row.Amount}
          </>
        ),
      },
      {
        field: '',
        headerName: '操作',
        width: 150,
        renderCell: (param) => (
          <>
            <Button color='error' onClick={(event) => {
              event.stopPropagation();
              handleDelete(param.row)
            }}>刪除</Button>
          </>
        ),
      },
    ]
    setColumns(columnsInit)

    return () => {
      // console.log("checkboxSelected", checkboxSelected)
      setCheckboxSelected([])
    }
  }, [])

  const handleDelete = (target: cartListType) => {
    setDeleteTarget(target)
    setOpen(true)
    setAction("deleteCartItem")
  }

  const handleCheckOut = () => {
    setOpen(true)
    setAction("checkOut")
  }
  // const checkOutListHandle = () => {
  //   return checkboxSelected.map(cartItemId => {
  //     const index = cartList.findIndex(item => item.CartItemId == cartItemId)
  //     return <div key={cartItemId}>{cartList[index].Book.Title}-{cartList[index].Book.Author} 數量:{cartList[index].Count} 總價:{cartList[index].Amount}</div>
  //   })
  // }
  const checkOutListHandle = () => {
    return <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {
        checkboxSelected.map(cartItemId => {
          const index = cartList.findIndex(item => item.CartItemId == cartItemId)
          return <ListItem key={cartItemId}>
            <ListItemAvatar>
              <Avatar>
                <img src={`https://source.unsplash.com/40x40/?book&rnd=${cartItemId}`} alt='book'></img>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${cartList[index].Book.Title} - ${cartList[index].Book.Author}`}
              secondary={`${cartList[index].Count}本 單價$${cartList[index].Book.Price} 共$${cartList[index].Amount}`} />
          </ListItem>
        })
      }
    </List >
  }

  const totalPrice = checkboxSelected.reduce((acc: number, currCheckboxId) => {
    const index = cartList.findIndex(item => item.CartItemId == currCheckboxId)
    const price = Number(cartList[index]?.Amount)
    return acc + price
  }, 0)


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const API = {
      deleteCartItem: () => cartAPI.delete(deleteTarget!.CartItemId),
      deleteCart: () => cartAPI.deleteAllnoParam(),
      checkOut: () => checkoutAPI.post(checkboxSelected)
    }
    const content = {
      deleteCartItem: "刪除書籍",
      deleteCart: "清空購物車",
      checkOut: "訂單已建立"
    }
    setLoading(true);

    const res = await API[action]();
    console.log(res)
    if (res.Code == 200) {
      setSnackBar({
        message: `${content[action]}成功`,
        type: "success",
        open: true
      })
      setOpen(false)
      setCheckboxSelected([])
      fetchData()
    } else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
    setLoading(false)
  };

  return (
    <Container>
      <div className='flex justify-between mb-2 mt-2'>
        <div className='content-center'>
          <Chip label={`總項目 : ${cartList.length}`} color="primary" sx={{ marginRight: "5px" }} />
          <Chip label={`總數量 : ${cartList.reduce((acc, curr) => acc + Number(curr.Count), 0)}`} color="secondary" sx={{ marginRight: "5px" }} />
          {/* <Chip label={`總金額 : $ ${cartList.reduce((acc, curr) => acc + Number(curr.Amount), 0)}`} color="success" /> */}
        </div>
        <Button color='error'
          variant='outlined'
          onClick={() => {
            setOpen(true)
            setAction("deleteCart")
          }}>清空購物車</Button>
      </div>
      <FormControlLabel control={<Switch checked={listMode} onChange={() => setListMode(!listMode)} />} label="List Mode" />
      {listMode ?
        <>
          <Tables
            columns={columns}
            rows={cartList}
          ></Tables>
        </>
        :
        cartList.length > 0 ?
          <>
            <ItemList cartList={cartList} countChangeHandle={countChangeHandle} handleDelete={handleDelete} />
          </>
          :
          <div className='text-center'>尚未添加圖書</div>
      }
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          </Typography> */}
          {action == "deleteCart" && "確定要清空購物車嗎?"}
          {action == "deleteCartItem" && `確定要刪除 "${deleteTarget?.Book?.Author} - ${deleteTarget?.Book?.Title}" 圖書嗎?`}
          {action == "checkOut" && <>
            {checkOutListHandle()}
            <div className='px-4'>共 ${totalPrice}</div>
          </>}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button type="submit" color='error'>確定</Button>
            <Button onClick={() => setOpen(false)}>取消</Button>
          </Typography>
        </Box>
      </Modal >
      <Badge color="secondary" overlap="circular"
        badgeContent={checkboxSelected.length}
        sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button variant="contained"
          disabled={checkboxSelected.length == 0}
          sx={{ width: 80, height: 80, borderRadius: '50%' }}
          onClick={handleCheckOut}>
          ${totalPrice}
          <br></br>
          結帳
        </Button>
      </Badge>
    </Container >
  )
}

export default Cart