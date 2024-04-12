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

export const loadingAtom = atom(false);
export const loginAtom = atom<loginType>(initLogin);
export const snackBarOpenAtom = atom(false);
export const snackBarMessageAtom = atom("");
export const snackBarTypeAtom = atom<"success" | "info" | "warning" | "error">("success");

