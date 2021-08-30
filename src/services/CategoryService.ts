import axios from '../axios';

export const getCategories = async (): Promise<string[]> => axios.get('/categories').then(res => res.data);