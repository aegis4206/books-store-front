import { useState, useEffect } from 'react'
// import { bookType } from '../../types/book';
import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { cartAPI } from '../../utils/fetchUrls'
import { cartListType } from '../../types/cart';
import Tables from '../tables'

import { checkboxSelectedAtom } from '../../states/table';
import { GridColDef } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, Chip } from '@mui/material';

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
  { field: 'Title', headerName: '書名', width: 200 },
  { field: 'Author', headerName: '作者', width: 150 },
  { field: 'Pyear', headerName: '出版年份', width: 100 },
  { field: 'Price', headerName: '價格', width: 80 },
]

const Cart = () => {
  const [cartList, setCartList] = useState<cartListType[]>([])
  const [columns, setColumns] = useState<GridColDef[]>([])
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<cartListType>({})


  const [, setLoading] = useAtom(loadingAtom)

  const [, setSnackBar] = useAtom(snackBarAtom)

  const [checkboxSelected,] = useAtom(checkboxSelectedAtom)

  //MUI無法在renderCell內使用原list
  let tempList: cartListType[] = []

  const fetchData = async () => {
    setLoading(true)
    const res = await cartAPI.get()
    if (res.Code == 200) {
      setCartList(res.Data)
      console.log(res)
      tempList = res.Data
    } else {
      setSnackBar({
        message: res.Msg,
        type: "error",
        open: true
      })
    }
    setLoading(false)
  }
  useEffect(() => { console.log(cartList) }, [cartList])

  const countChangeHandle = async (event: React.MouseEvent<HTMLElement>, count: number, cartItemId: number | string) => {
    event.stopPropagation();
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
        field: column.field, headerName: column.headerName, width: column.width,
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
            <Button onClick={(event) =>
              countChangeHandle(event, Number(param.row.Count) - 1, param.id)
            }>-</Button>
            {param.row.Count}
            <Button onClick={(event) =>
              countChangeHandle(event, Number(param.row.Count) + 1, param.id)
            }
            >+</Button>
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
              setDeleteTarget(param.row)
              setOpen(true)
              setAction("deleteCartItem")
            }}>刪除</Button>
          </>
        ),
      },
    ]
    setColumns(columnsInit)
  }, [])



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const API = {
      deleteCartItem: () => cartAPI.delete(deleteTarget.CartItemId),
      deleteCart: () => cartAPI.deleteAllnoParam(),
    }
    const content = {
      deleteCartItem: "刪除購物項",
      deleteCart: "清空購物車",
    }
    setLoading(true);

    const res = await API[action]();
    console.log(res)
    if (res.Code == 200) {
      setSnackBar({
        message: `${content[action]}書籍成功`,
        type: "success",
        open: true
      })
      setOpen(false)
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
    <div>
      <div className='flex justify-between mb-2'>
        <div className='content-center'>
          <Chip label={`總項目 : ${cartList.length}`} color="primary" sx={{ marginRight: "10px" }} />
          <Chip label={`總數量 : ${cartList.reduce((acc, curr) => acc + Number(curr.Count), 0)}`} color="secondary" sx={{ marginRight: "10px" }} />
          <Chip label={`總金額 : $ ${cartList.reduce((acc, curr) => acc + Number(curr.Amount), 0)}`} color="success" />
        </div>
        <Button color='error'
          onClick={() => {
            setOpen(true)
            setAction("deleteCart")
          }}>清空購物車</Button>
      </div>
      <Tables
        columns={columns}
        rows={cartList}
      ></Tables>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {action == "deleteCart" ? "確定要清空購物車嗎?" : `確定要刪除 "${deleteTarget.Book?.Author} - ${deleteTarget.Book?.Title}" 圖書嗎?`}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button type="submit" color='error'>確定</Button>
            <Button onClick={() => setOpen(false)}>取消</Button>
          </Typography>
        </Box>
      </Modal >
    </div >
  )
}

export default Cart