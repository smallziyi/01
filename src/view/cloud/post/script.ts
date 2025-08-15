import useAxios from '@/axios';
import { QueryPositionParams } from './config.ts';
import { Post } from '@/view/base/code/post/config.ts';

const adminAxios = useAxios();

export const fetchList = async (queryPositionParams: QueryPositionParams) => {
	return (await adminAxios.get<Page<Post>>('/base/code/position', { params: queryPositionParams })).data;
};
