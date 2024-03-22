export interface bookType {
    Id: number | undefined,
    Title: string,
    Author: string,
    Pyear: string,
    Price: string,
    Sales: string,
    Stock: string,
    ImgPath: string,
    [key: string]: unknown | string;
}