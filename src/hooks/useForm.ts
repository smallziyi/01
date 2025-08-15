import { TablePaginationConfig } from 'ant-design-vue';
import _ from 'lodash';

export default function useForm<T extends { current: number; pageSize: number }>(
	initQueryForm: T,
	customFetchData: () => void,
) {
	const formModelCopy = ref<T>({} as T);
	const queryFormModel = ref<T>({ ...initQueryForm });
	const queryParams = ref<T>({ ...initQueryForm });

	const handleTableChange = (_pagination: TablePaginationConfig) => {
		queryParams.value.current = _pagination.current!;
		queryParams.value.pageSize = _pagination.pageSize!;
		fetchData();
	};

	const reset = () => {
		queryFormModel.value = _.cloneDeep(formModelCopy.value);
		search();
	};
	const search = () => {
		queryParams.value.current = 1;
		queryParams.value = _.cloneDeep(queryFormModel.value);
		fetchData();
	};

	const fetchData = customFetchData;

	onMounted(() => {
		formModelCopy.value = _.cloneDeep(queryParams.value);
		search();
	});
	return {
		queryFormModel,
		queryParams,
		reset,
		search,
		handleTableChange,
	};
}
