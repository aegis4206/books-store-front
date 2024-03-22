import { atom } from "jotai";
import { bookType } from "../tpye/tpye";


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