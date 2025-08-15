import useAxios from '@/axios';
import { QueryOccupationParams, ResponseOccupationItem } from './config.ts';

const axios = useAxios();

export const getOccupationList = async (params: QueryOccupationParams) => {
	return await axios.get<Page<ResponseOccupationItem>>('/base/code/occupation', { params });
};

export const changeStartStatus = async (occupationId: string) => {
	return await axios.put(`/base/code/occupation/${occupationId}/disable`);
};
