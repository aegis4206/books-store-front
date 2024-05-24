export const bookKeyChinese = {
    Id: '編號',
    Title: '書名',
    Author: '作者',
    Pyear: '出版年份',
    Price: '價格',
    Sales: '銷量',
    Stock: '庫存',
    // ImgPath: '封面圖片',
}
export interface bookType {
    Id: number | undefined,
    Title: string,
    Author: string,
    Pyear: string,
    Price: string,
    Sales: string,
    Stock: string,
    ImgPath: string | null,
    [key: string]: unknown | string;
}