import { bookType } from "./book";

export interface cartListType {
    CartId: string,
    CartItemId: string,
    Count: string,
    Amount: string,
    Book: bookType
}