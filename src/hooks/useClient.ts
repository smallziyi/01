import { getAllClientOptions } from '@/axios';

type clientType = 'role' | 'user';

export default function (type: clientType) {
	const allClientList = ref<Option[]>([
		{
			value: '1',
			label: `云后台${type === 'role' ? '角色' : '用户'}`,
		},
	]);

	onMounted(() => {
		getAllClientOptions().then((res) => {
			allClientList.value.push(...res);
		});
	});

	return { allClientList };
}
