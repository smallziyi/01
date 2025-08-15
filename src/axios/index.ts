import axios, { AxiosError } from 'axios';
import queryString from 'query-string';
import { message } from 'ant-design-vue';
import router from '@/router';

const useAxios = () => {
	const instance = axios.create({
		baseURL: `${window.config.api}`,
		timeout: 6000,
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		paramsSerializer(params) {
			return queryString.stringify(params, { arrayFormat: 'none' });
		},
	});
	instance.interceptors.request.use((request) => {
		request.headers.Authorization = sessionStorage.getItem('jwt');
		return request;
	});
	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error: AxiosError) => {
			if (error.response) {
				const route = useRoute();
				if (error.response.status === 401 && route.path !== '/login') {
					message.error({ key: 'not_login', content: '用户未登录' });
					sessionStorage.removeItem('jwt');
					router.push('/login');
					return Promise.reject();
				}
				message.error(error.response.data as string);
				return Promise.reject();
			}

			message.error('请求出错，请稍后再试');
			return Promise.reject();
		},
	);

	return instance;
};

export default useAxios;
export const http = useAxios();

export * from './module/base.api.ts';
export * from './module/report.api.ts';
export * from './module/teach.api.ts';
export * from './module/resource.api.ts';
export * from './module/feedback.api.ts';
export * from './module/file.api.ts';
export * from './module/admin.api.ts';
export * from './module/analyse.api.ts';
export * from './module/cloud.api.ts';
export * from './module/screen.api.ts';
