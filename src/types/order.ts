export interface orderType {
    OrderId: string,
    CreatedTime: Date,
    TotalCount: number,
    TotalAmount: number,
    State: number, // 0 未發貨 1已發貨 2完成交易
    UserId: number,
    OrderItems: orderItemType[],
    [key: string]: unknown | string | number | Date;
}

interface orderItemType {
    OrderItemId: number,
    Count: number,
    Amount: number,
    Title: string,
    Author: string,
    Price: number,
    ImgPath: string,
    OrderId: string,
    BookId: string,
}