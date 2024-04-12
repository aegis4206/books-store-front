import { atom } from "jotai";
import { bookType } from "../types/book";


export const initBook: bookType = {
    Id: undefined,
    Title: "",
    Author: "",
    Pyear: "",
    Price: "",
    Sales: "",
    Stock: "",
    ImgPath: "",
}

export const selectedBookAtom = atom<bookType>(initBook);