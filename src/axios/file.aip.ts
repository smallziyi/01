import useAxios from '@/axios/index.ts';
import { AxiosProgressEvent } from 'axios';

const axios = useAxios();

export const uploadFile = async (file: File, callback?: (event: AxiosProgressEvent) => void) => {
	const data = new FormData();
	data.append('file', file);
	return await axios.post<IFile>('/base/file/upload', data, {
		headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStorage.getItem('jwt') },
		timeout: 0,
		onUploadProgress(progressEvent) {
			callback && callback(progressEvent);
		},
	});
};
