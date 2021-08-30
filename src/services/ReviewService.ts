import { AxiosResponse } from 'axios';
import axios from '../axios';
import { IReview } from '../models/IReview';

const create = (review: IReview): Promise<AxiosResponse<any>> => {
    return axios.post('/reviews', review);
}

const edit = (review: IReview): Promise<AxiosResponse<any>> => {
    return axios.put('/reviews/' + review.id, review);
}

export const submit = (review: IReview): Promise<AxiosResponse<any>> => {
    if (review.id === null) {
        return create(review);
    } else {
        return edit(review);
    }
}

export const _delete = (reviewId: number): Promise<AxiosResponse<any>> => {
    return axios.delete('/reviews/' + reviewId)
}

export const bulkDelete = (reviewIds: number[]): Promise<AxiosResponse<any>[]> => {
    const deleteRequests = reviewIds.map((id) => {
        return axios.delete('/reviews/' + id);
    })

    const res = Promise.all(deleteRequests);

    return Promise.resolve(res);
}

export const get = async ({ queryKey }: any): Promise<IReview[]> => {
    const [_key, { isPublishedFilterActive, isDraftFilterActive, searchInput }] = queryKey;
    const statusParams: boolean[] = ((): boolean[] => {
        const queryArr = [];
        if (isPublishedFilterActive) {
            queryArr.push(false);
        }

        if (isDraftFilterActive) {
            queryArr.push(true);
        }

        return queryArr;
    })()

    const queryParams = {
        isDraft: statusParams
    } as any;

    let queryUrl = '/reviews';
    if (searchInput) {
        queryUrl += '?book.title_like=' + searchInput;
    }

    const res = await axios.get(queryUrl, { params: queryParams })
    return res.data as IReview[];
}

export const getById = async (id: number): Promise<IReview> => {
    return axios.get('/reviews/' + id)
        .then(res => res.data);
}