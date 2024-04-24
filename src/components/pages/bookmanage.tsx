import { Button, Grid, Modal, Box, Typography, TextField } from '@mui/material'
import React, { useEffect, useState, } from 'react'
import { booksAPI } from '../../utils/fetchUrls'
import Tables from '../tables'
import { GridColDef } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { selectedBookAtom, initBook } from "../../states/books";
import { checkboxSelectedAtom } from '../../states/table';
import { loadingAtom, snackBarAtom, } from '../../states/global';
import { positiveInteger } from '../../utils/validate';
import { bookKeyChinese, bookType } from '../../types/book';

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

interface inputType {
    Id: boolean,
    Title: boolean,
    Author: boolean,
    Pyear: boolean,
    Price: boolean,
    Sales: boolean,
    Stock: boolean,
    ImgPath: boolean,
    [key: string]: boolean
}
// const bookKeyChinese = {
//     Id: '編號',
//     Title: '書名',
//     Author: '作者',
//     Pyear: '出版年份',
//     Price: '價格',
//     Sales: '銷量',
//     Stock: '庫存',
//     ImgPath: '封面圖片',

// }

const MemoizedTables = React.memo(Tables);


const Bookmanage = () => {
    const [columns, setColumns] = useState<GridColDef[]>([])
    const [bookList, setBookList] = useState<bookType[]>([])
    const [selectedBook, setSelectedBook] = useAtom(selectedBookAtom)
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<string>("edit")
    const [checkboxSelected,] = useAtom(checkboxSelectedAtom)
    const [, setLoading] = useAtom(loadingAtom)

    const [, setSnackBar] = useAtom(snackBarAtom)



    const [helperText, setHelperText] = useState({
        Id: "",
        Title: "",
        Author: "",
        Pyear: "",
        Price: "",
        Sales: "",
        Stock: "",
        ImgPath: "",
    })
    const [inputError, setInputError] = useState<inputType>({
        Id: false,
        Title: false,
        Author: false,
        Pyear: false,
        Price: false,
        Sales: false,
        Stock: false,
        ImgPath: false,
    })



    const fetchData = async () => {
        setLoading(true)
        const res = await booksAPI.get()
        if (res.Code == 200) {
            res.Data.length !== 0 && setBookList(res.Data)
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
            { field: 'Id', headerName: '編號', width: 50 },
            { field: 'Title', headerName: '書名', width: 200 },
            { field: 'Author', headerName: '作者', width: 150 },
            { field: 'Pyear', headerName: '出版年份', },
            { field: 'Price', headerName: '價格', },
            { field: 'Sales', headerName: '銷量', },
            { field: 'Stock', headerName: '庫存', },
            { field: 'ImgPath', headerName: '封面圖片', },
            {
                field: '',
                headerName: '操作',
                width: 150,
                renderCell: (param) => (
                    <>
                        <Button color='info' onClick={(event) => {
                            event.stopPropagation();
                            setSelectedBook(param.row)
                            setOpen(true)
                            setAction("edit")
                        }}>編輯</Button>
                        <Button color='error' onClick={(event) => {
                            event.stopPropagation();
                            setSelectedBook(param.row)
                            setOpen(true)
                            setAction("delete")
                        }}>刪除</Button>
                    </>
                ),
            },
        ]
        setColumns(columnsInit)
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { Id } = selectedBook;
        // console.log(Title, Author, Pyear, Price, Sales, Stock, ImgPath);
        if (action != "deleteAll") {
            if (testEmpty()) return;
            if (testNumber("Pyear") || testNumber("Price") || testNumber("Sales") || testNumber("Stock")) return;
        }

        const body = {
            ...selectedBook
        }
        const API = {
            edit: () => booksAPI.put(Id!, body),
            add: () => booksAPI.post(body),
            delete: () => booksAPI.delete(Id!),
            deleteAll: () => booksAPI.deleteAll(checkboxSelected)
        }
        const content = {
            edit: "編輯",
            add: "新增",
            delete: "刪除",
            deleteAll: "刪除全部所選"
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

    const resetHandle = (target: string, e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedBook(pre => ({ ...pre, [target]: e.target.value }))
        if (inputError[target] == false) return;
        setHelperText(pre => ({ ...pre, [target]: "" }))
        setInputError(pre => ({ ...pre, [target]: false }))
    }

    const formatErrHandle = (target: string, msg: string) => {
        setHelperText(pre => ({ ...pre, [target]: msg }))
        setInputError(pre => ({ ...pre, [target]: true }))
        // setLoading(false)
    }

    const form = Object.keys(bookKeyChinese).map(key => {
        return <Grid item xs={6} key={key}>
            <TextField
                key={key}
                disabled={key == 'Id'}
                margin="normal"
                required={key != 'Id'}
                fullWidth
                name={key}
                label={bookKeyChinese[key]}
                // type={key}
                id={key}
                error={inputError[key]}
                helperText={helperText[key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => resetHandle(key, e)}
                value={selectedBook[key]}
            />
        </Grid>
    })

    const testEmpty = () => {
        const res: string[] = []
        Object.keys(selectedBook).forEach(key => {
            if (selectedBook[key] == "") {
                res.push(key)
            }
        })
        if (res.length !== 0) {
            res.forEach(key => {
                formatErrHandle(key, `請輸入${bookKeyChinese[key]}`)
            })
            return true
        }
        return false
    }
    const testNumber = (key: string) => {
        if (positiveInteger(selectedBook[key])) {
            formatErrHandle(key, `格式錯誤`)
            return true
        }
        return false
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        onClick={() => {
                            setSelectedBook(initBook)
                            setOpen(true)
                            setAction("add")
                        }}>新增書籍</Button>
                    <Button color='warning'
                        disabled={checkboxSelected.length == 0}
                        onClick={() => {
                            setOpen(true)
                            setAction("deleteAll")
                        }}>刪除全部所選</Button>
                </Grid>
                <Grid item xs={12}>
                    <MemoizedTables
                        columns={columns}
                        rows={bookList}
                    ></MemoizedTables>
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
                    {(action == "add" || action == "edit") && <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {action == "edit" ? "編輯書籍" : "新增書籍"}
                        </Typography>
                        <Grid container spacing={2}>
                            {form}
                            <Grid item xs={6}>

                            </Grid>
                        </Grid>
                    </>}

                    {action == "delete" && <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            刪除書籍
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            確定要刪除 編號 : {selectedBook!.Id} 書名 : {selectedBook!.Title}
                        </Typography>

                    </>}
                    {action == "deleteAll" && <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            刪除書籍
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            確定要刪除全部所選籍籍 編號 : {checkboxSelected.join('、')}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            全部所選籍籍共 : {checkboxSelected.length} 筆
                        </Typography>
                    </>}
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button type="submit" color={action == "edit" ? 'info' : 'error'}>確定</Button>
                        <Button onClick={() => setOpen(false)}>取消</Button>
                    </Typography>
                </Box>
            </Modal >
        </>

    )
}

export default Bookmanage