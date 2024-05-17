import { Button, Grid, Modal, Box, Typography, Chip, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material'
import React, { useEffect, useState, } from 'react'
import { ordersAPI, updateOrderAPI } from '../../utils/fetchUrls'
import Tables from '../tables'
import { GridColDef } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { orderType } from '../../types/order';
import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "10px"
};


const MemoizedTables = React.memo(Tables);


const Ordermanage = () => {
    const [columns, setColumns] = useState<GridColDef[]>([])
    const [orderList, setOrderList] = useState<orderType[]>([])
    const [selectedOrder, setSelectedOrder] = useState<orderType>()
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<string>("shipped")
    const [, setLoading] = useAtom(loadingAtom)

    const [, setSnackBar] = useAtom(snackBarAtom)


    const fetchData = async () => {
        setLoading(true)
        const res = await ordersAPI.get()
        if (res.Code == 200) {
            res.Data.length !== 0 && setOrderList(res.Data)
            console.log(res.Data)
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
        fetchData()

        const columnsInit: GridColDef[] = [
            { field: 'OrderId', headerName: '編號', width: 100 },
            {
                field: 'CreateTime', headerName: '訂單建立時間', width: 200,
                renderCell: (param) => {
                    return moment(param.row.CreatedTime).format("YYYY-MM-DD HH:mm:ss").toLocaleString()
                }
            },
            {
                field: 'State', headerName: '狀態', width: 100,
                renderCell: (param) => {
                    switch (param.row.State) {
                        case 0:
                            return < Chip variant='outlined' size='small' label="未出貨" color="default" sx={{ marginRight: "5px" }} />
                        case 1:
                            return < Chip variant='outlined' size='small' label="已出貨" color="info" sx={{ marginRight: "5px" }} />
                        default:
                            return < Chip variant='outlined' size='small' label="已完成" color="success" sx={{ marginRight: "5px" }} />
                    }
                }
            },
            { field: 'TotalCount', headerName: '總數量', },
            { field: 'TotalAmount', headerName: '總價格', },
            { field: 'UserId', headerName: '會員編號', },
            {
                field: '',
                headerName: '操作',
                width: 240,
                renderCell: (param) => (
                    <>
                        <Button
                            disabled={param.row.State != 0}
                            sx={{ marginRight: "5px" }}
                            variant='outlined'
                            color='secondary' onClick={(event) => {
                                event.stopPropagation();
                                setSelectedOrder(param.row)
                                setOpen(true)
                                setAction("shipped")
                            }}>出貨</Button>
                        <Button
                            sx={{ marginRight: "5px" }}
                            variant='outlined'
                            color='info' onClick={(event) => {
                                event.stopPropagation();
                                setSelectedOrder(param.row)
                                setOpen(true)
                                setAction("detail")
                            }}>詳情</Button>
                        <Button
                            disabled
                            variant='outlined'
                            color='error' onClick={(event) => {
                                event.stopPropagation();
                                setSelectedOrder(param.row)
                                setOpen(true)
                                setAction("delete")
                            }}>刪除</Button>
                    </>
                ),
            },
        ]
        setColumns(columnsInit)

    }, [])


    const handleSubmit = async () => {
        if (action == "detail") return setOpen(false);

        setLoading(true);
        const res = await updateOrderAPI.patch(selectedOrder?.OrderId, { State: "1" })
        console.log(res)
        if (res.Code == 200) {
            setSnackBar({
                message: `訂單已完成`,
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
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MemoizedTables
                        checkbox={false}
                        columns={columns}
                        rows={orderList}
                    ></MemoizedTables>
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {action == "shipped" && <Typography id="modal-modal-title" variant="h6" component="h2">
                        請確認將此訂單
                        <br></br>
                        {selectedOrder?.OrderId}
                        <br></br>
                        變更為已出貨
                    </Typography>}
                    {
                        action == "detail" && <>
                            <Chip variant='outlined' size='small' label={`${selectedOrder?.State == 0 ? "未發貨" : selectedOrder?.State == 1 ? "已發貨" : "已完成"}`} color={`${selectedOrder?.State == 0 ? "default" : selectedOrder?.State == 1 ? "info" : "success"}`} sx={{ marginRight: "5px" }} />
                            訂單編號 : {selectedOrder?.OrderId}
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                {
                                    selectedOrder?.OrderItems.map(orderItem => <ListItem sx={{ padding: 0 }} key={orderItem.OrderItemId}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <img src={`https://source.unsplash.com/40x40/?book&rnd=${orderItem.OrderItemId}`} alt='book'></img>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${orderItem.BookId} : ${orderItem.Title} - ${orderItem.Author}`}
                                            secondary={`${orderItem.Count}本 單價$${orderItem.Price} 共$${orderItem.Amount}`} />
                                    </ListItem>
                                    )
                                }
                            </List >
                            共{selectedOrder?.TotalCount}本 ${selectedOrder?.TotalAmount}元
                        </>
                    }
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button
                            sx={{ marginRight: "5px" }}
                            variant='outlined'
                            color="secondary"
                            onClick={() => handleSubmit()}
                        >確定</Button>
                        <Button
                            variant='outlined'
                            onClick={() => setOpen(false)}>取消</Button>
                    </Typography>
                </Box>
            </Modal >
        </>

    )
}

export default Ordermanage