import fetchActions from "./fetchActions";

export const loginAPI = fetchActions("login")
export const logoutAPI = fetchActions("logout")


export const registAPI = fetchActions("regist")

export const booksAPI = fetchActions("books")

export const cartAPI = fetchActions("cart")

export const checkoutAPI = fetchActions("checkout")

export const ordersAPI = fetchActions("orders")
export const userOrdersAPI = fetchActions("userorders")

export const updateOrderAPI = fetchActions("order")

