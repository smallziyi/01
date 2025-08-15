import security from '@/utils/security.ts';

function useRouterParams<T>() {
	const router = useRouter();
	return security.base64Decode<T>(router.currentRoute.value.query.v as string);
}

export default useRouterParams;
