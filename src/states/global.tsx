import { atom } from "jotai";


export const loadingAtom = atom(false);
export const snackBarOpenAtom = atom(false);
export const snackBarMessageAtom = atom("");
export const snackBarTypeAtom = atom<"success" | "info" | "warning" | "error">("success");

