import { http } from '@/axios';
import { AxiosProgressEvent } from 'axios';

export const uploadFile = async (file: File, callback?: (event: AxiosProgressEvent) => void) => {
	const data = new FormData();
	data.append('file', file);
	return await http.post<IFile>('/base/file/upload', data, {
		headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStorage.getItem('jwt') },
		timeout: 0,
		onUploadProgress(progressEvent: AxiosProgressEvent) {
			callback && callback(progressEvent);
		},
	});
};

export const uploadFiles = async (files: File[], callback?: (event: AxiosProgressEvent) => void) => {
	const data = new FormData();
	files.forEach((file) => data.append('files', file));
	return await http.post<IFile[]>('/base/file/uploadBatch', data, {
		headers: { 'Content-Type': 'multipart/form-data', Authorization: sessionStorage.getItem('jwt') },
		onUploadProgress(progressEvent: AxiosProgressEvent) {
			callback && callback(progressEvent);
		},
	});
};
