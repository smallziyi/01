import { fetchRoleDrop } from '@/axios';
type dropType = string | string[];
type dictItem = {
	type: string;
	dropMethod: Function;
};

const dropDict: dictItem[] = [{ type: 'role', dropMethod: fetchRoleDrop }];

const resultArray = ref<Option[] | Option[][]>([]);
const useSelectOptions = (type: dropType, clientId: string) => {
	if (typeof type === 'string') {
		dropDict
			.find((item: dictItem) => item.type === type)
			?.dropMethod(clientId)
			.then((res: Option[]) => {
				resultArray.value = res.filter((item: Option) => item.value !== '170351765777096707');
			});
	}
	return resultArray;
};

export default useSelectOptions;
