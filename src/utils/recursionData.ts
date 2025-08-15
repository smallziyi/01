// 定义原始数据结构类型
interface OriginalData {
	id: string;
	parentId?: string;
	name: string;
	children?: OriginalData[];
}

// 定义转换后的数据结构类型
interface TransformedData {
	value: string;
	label: string;
	children?: TransformedData[];
}

// 转换函数
const recursionData = (items: OriginalData[]): TransformedData[] => {
	return items.map((item) => {
		const newItem: TransformedData = {
			value: item.id,
			label: item.name,
		};
		if (item.children) {
			newItem.children = recursionData(item.children);
		}
		return newItem;
	});
};

export default recursionData;
