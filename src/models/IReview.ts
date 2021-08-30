import { IBook } from "./IBook";

export interface IReview {
    id?: number | null;
    book: IBook;
    statement: string;
    rating: number;
    isDraft: boolean
}