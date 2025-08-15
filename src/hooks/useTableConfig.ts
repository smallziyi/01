import { PaginationProps } from 'ant-design-vue';

export function useTableConfig() {
	const loading = ref<boolean>(false);
	const pagination = ref<PaginationProps>({
		total: 0,
		defaultCurrent: 1,
		defaultPageSize: 10,
		current: 1,
		pageSize: 10,
		showSizeChanger: false,
		// 没有数据或者只有一页数据时隐藏分页栏
		hideOnSinglePage: true,
	});

	return { loading, pagination };
}
