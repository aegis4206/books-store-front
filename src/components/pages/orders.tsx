import { Button, Modal, Box, Typography, Chip, List, ListItem, ListItemAvatar, ListItemText, Avatar, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState, } from 'react'
import { userOrdersAPI, updateOrderAPI } from '../../utils/fetchUrls'
import { useAtom } from "jotai";
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { orderType } from '../../types/order';
import OrderItemList from '../order/ItemList';

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




const Bookmanage = () => {
    const [orderList, setOrderList] = useState<orderType[]>([])
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<orderType>()

    const [, setLoading] = useAtom(loadingAtom)

    const [, setSnackBar] = useAtom(snackBarAtom)


    const fetchData = async () => {
        setLoading(true)
        const res = await userOrdersAPI.get()
        if (res.Code == 200) {
            res.Data && res.Data.length !== 0 && setOrderList(res.Data)
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

    }, [])


    const handleSubmit = async () => {
        if (action == "detail") return setOpen(false);

        setLoading(true);
        const res = await updateOrderAPI.patch(selectedOrder?.OrderId, { State: "2" })
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

    const clickHandle = (action: string) => (order: orderType) => {
        setAction(action);
        setSelectedOrder(order);
        setOpen(true);
    }
    // const detailClick = clickHandle("detail")
    // const confirmClick = clickHandle("confirm")


    //Tabs
    const [value, setValue] = React.useState('all');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const listfilter = orderList.filter(item => {
        switch (value) {
            case "noShipped":
                return item.State == 0
            case "shipped":
                return item.State == 1
            case "complete":
                return item.State == 2
            default:
                return true
        }
    })

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant='fullWidth'
                    indicatorColor="secondary"
                    textColor="secondary"
                >
                    <Tab value="all" label="全部" />
                    <Tab value="noShipped" label="未發貨" />
                    <Tab value="shipped" label="已發貨" />
                    <Tab value="complete" label="已完成" />
                </Tabs>
            </Box>
            <OrderItemList orderList={listfilter} clickHandle={clickHandle}></OrderItemList>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {action == "confirm" && <Typography id="modal-modal-title" variant="h6" component="h2">
                        請確認收到商品無誤
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
                                                <img src={orderItem.ImgPath ? `${import.meta.env.VITE_API_URL}bookimg/${orderItem.ImgPath}` : `https://source.unsplash.com/40x40/?book&rnd=${orderItem.OrderItemId}`} alt='book'></img>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${orderItem.Title} - ${orderItem.Author}`}
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
                            color={'secondary'}
                            onClick={() => handleSubmit()}>確定</Button>
                        <Button
                            variant='outlined'
                            onClick={() => setOpen(false)}>取消</Button>
                    </Typography>
                </Box>
            </Modal >
        </>

    )
}

export default Bookmanage