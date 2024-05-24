import { Button, Grid, Box, Typography, Card, CardMedia, Chip, } from '@mui/material'
import { orderType } from '../../types/order';
import moment from 'moment';

interface propsType {
    orderList: orderType[],
    clickHandle: (action: string) => (order: orderType) => void,
}

const OrderItemList = ({ orderList, clickHandle }: propsType) => {
    const detailClick = clickHandle("detail")
    const confirmClick = clickHandle("confirm")

    return (
        <>
            <Grid container columns={1}>
                {orderList.length > 0 ? orderList.map(order => <Grid item key={order.OrderId} xs={1} sm={1} sx={{ marginBottom: "10px" }}>
                    <Card sx={{ display: 'flex', width: "auto", height: "120px" }}>
                        <CardMedia
                            component="img"
                            image={order.OrderItems?.[0]?.ImgPath ? `${import.meta.env.VITE_API_URL}bookimg/${order.OrderItems?.[0].ImgPath}` : `https://source.unsplash.com/100x100/?book&rnd=${order.OrderItems?.[0].OrderItemId}`}
                            alt={"訂單"}
                            sx={{ width: "100px", height: "100px", alignSelf: "center", marginLeft: "10px" }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: "10px", width: "100%" }}>
                            <div style={{ flex: '1 0 auto' }}>
                                <Typography variant="caption" component="div" className='flex justify-between'>
                                    <div>
                                        <Chip variant='outlined' size='small' label={`${order.State == 0 ? "未發貨" : order.State == 1 ? "已發貨" : "已完成"}`} color={`${order.State == 0 ? "default" : order.State == 1 ? "info" : "success"}`} sx={{ marginRight: "5px" }} />
                                        {order.TotalCount}本 ${order.TotalAmount}元
                                    </div>
                                </Typography>
                                <Typography variant="caption" color="text.secondary" component="div">
                                    創建時間 : {moment(order.CreatedTime).format("YYYY-MM-DD HH:mm:ss").toLocaleString()}
                                </Typography>
                            </div>
                            <div className='flex align-middle justify-between'>
                                <Button variant='contained' size='small' color='info' onClick={() => detailClick(order)}>查看詳情</Button>
                                <Button disabled={order.State != 1} variant='contained' size='small' color='warning' onClick={() => confirmClick(order)}>確認收貨</Button>
                            </div>
                        </Box>
                    </Card>
                </Grid>)
                    : <Grid item xs={1} sm={1} sx={{ marginTop: "10px" }}>
                        <Typography align='center' variant='h6' color="orangered">
                            尚未有任何訂單
                        </Typography>
                    </Grid>}
            </Grid >
        </>

    )
}

export default OrderItemList