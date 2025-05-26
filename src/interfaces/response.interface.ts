export interface IResponse<T = any> {
    data: T | T[];
    message: string;
    totalRecords?: number;
}