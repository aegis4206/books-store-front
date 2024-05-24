import { useEffect } from 'react'
import { cartListType } from '../../types/cart';
import { Box, Typography, Grid, Card, CardMedia, Checkbox, } from '@mui/material';
import { checkboxSelectedAtom } from '../../states/table';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from "jotai";
import { useState } from 'react';

interface propsType {
    cartList: cartListType[],
    countChangeHandle: (count: number, cartItemId: number | string) => void,
    handleDelete: (target: cartListType) => void,
}
interface checkboxListType {
    [key: string]: boolean
}

const ItemList = ({ cartList, countChangeHandle, handleDelete }: propsType) => {

    const [checkboxSelected, setCheckboxSelected] = useAtom(checkboxSelectedAtom)
    const [checkboxList, setCheckboxList] = useState<checkboxListType>()

    const checkboxListInitHandle = () => {
        const checkboxListInit = {}
        cartList.forEach(item => checkboxListInit[item.CartItemId] = false)
        if (checkboxSelected.length > 0) {
            checkboxSelected.forEach(itemId => checkboxListInit[itemId.toString()] = true)
        }
        setCheckboxList(checkboxListInit)
    }

    useEffect(() => {
        if (cartList.length > 0) {
            checkboxListInitHandle()
        }
    }, [cartList])

    const checkboxChangeHandle = (cartItemId: string) => {
        setCheckboxList(pre => {
            if (pre) {
                const newList = { ...pre }
                newList[cartItemId] = !newList[cartItemId]

                const checkboxSelectedTemp: string[] = []
                Object.keys(newList).forEach(key => {
                    if (newList[key]) {
                        checkboxSelectedTemp.push(key)
                    }
                })
                setCheckboxSelected(checkboxSelectedTemp)
                return newList
            }
            return pre
        })
    }

    const allSelectHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.checked)
        const checked = event.target.checked
        const keys = Object.keys(checkboxList!)
        const newCheckBoxList = { ...checkboxList }
        keys.forEach(key => {
            newCheckBoxList![key] = checked
        })
        setCheckboxList(newCheckBoxList)

        const newCheckBoxSelect = checked ? keys : []
        console.log(newCheckBoxSelect)
        setCheckboxSelected(newCheckBoxSelect)
    };


    return (
        <>
            <Checkbox onChange={allSelectHandle} color="secondary"
                indeterminate={checkboxSelected.length != 0 && (cartList.length != checkboxSelected.length)}
                checked={cartList.length == checkboxSelected.length}
            ></Checkbox>全選
            <Grid container columns={1}>
                {checkboxList && cartList.map(item => <Grid item key={item.CartItemId} xs={1} sm={1} sx={{ marginBottom: "10px" }}>
                    <Card sx={{ display: 'flex', width: "auto", height: "120px" }}>
                        <Checkbox checked={checkboxList[item.CartItemId]} onChange={() => checkboxChangeHandle(item.CartItemId)}></Checkbox>
                        <CardMedia
                            component="img"
                            image={item.Book.ImgPath ? `${import.meta.env.VITE_API_URL}bookimg/${item.Book.ImgPath}` : `https://source.unsplash.com/100x100/?book&rnd=${item.CartItemId}`}
                            alt={item.Book.Title}
                            sx={{ width: "100px", height: "100px", alignSelf: "center" }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: "10px", width: "100%" }}>
                            <div style={{ flex: '1 0 auto' }}>
                                <Typography variant="caption" component="div" className='flex justify-between'>
                                    <div>
                                        {item.Book.Title}
                                    </div>
                                    <div>
                                        <CloseIcon onClick={() => handleDelete(item)} color='action' />
                                    </div>
                                </Typography>
                                <Typography variant="caption" color="text.secondary" component="div">
                                    {item.Book.Author} {item.Book.Pyear}
                                </Typography>
                            </div>
                            <div className='flex align-middle justify-between'>
                                <div className='content-center'>
                                    ${item.Book.Price}
                                </div>
                                <div>
                                    <button
                                        className='border-solid border-2 rounded border-blue-300 inline-block w-8 text-center'
                                        onClick={() =>
                                            countChangeHandle(Number(item.Count) - 1, item.CartItemId)
                                        }>-</button>
                                    <span className='border-solid border-2 rounded border-blue-300 inline-block w-8 text-center -mx-0.5'>{item.Count}</span>
                                    <button
                                        className='border-solid border-2 rounded border-blue-300 inline-block w-8 text-center'
                                        onClick={() =>
                                            countChangeHandle(Number(item.Count) + 1, item.CartItemId)
                                        }>+</button>
                                </div>
                            </div>
                        </Box>
                    </Card>
                </Grid>)
                }
            </Grid >
        </>
    )
}

export default ItemList