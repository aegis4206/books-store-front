import { atom } from "jotai";
import {  GridRowSelectionModel } from '@mui/x-data-grid';


export const checkboxSelectedAtom = atom<GridRowSelectionModel>([]);