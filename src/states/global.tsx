import { atom } from "jotai";

interface loginType {
    Email: string,
    Id: number,
    SessionId: string
}
export const initLogin = {
    Email: '',
    Id: 0,
    SessionId: ''
}
interface snackbarType {
    open: boolean,
    message: string,
    type: "success" | "info" | "warning" | "error"
}

export const loadingAtom = atom(false);
export const loginAtom = atom<loginType>(initLogin);
export const snackBarAtom = atom<snackbarType>({
    open: false,
    message: '',
    type: "success"
});

