interface TreeNodes {
	label: string;
	value: string;
	parentId: string;
	children?: TreeNodes[];
}

interface InputNode {
	name: string;
	id: string;
	parentId: string;
	type: number;
}

function transformData(data: InputNode[]) {
	const schoolDepartmentGroup: TreeNodes[] = [];
	const majorGroup: TreeNodes[] = [];
	const classGroup: TreeNodes[] = [];
	const courseGroup: TreeNodes[] = [];

	const map: { [key: string]: TreeNodes } = {}; // 存储每个 id 对应的数据对象

	// 第一次遍历：初始化各个组
	data.forEach((item) => {
		const node: TreeNodes = {
			label: item.name,
			value: item.id,
			parentId: item.parentId,
			children: [],
		};
		map[item.id] = node;

		if (item.type === 5) {
			schoolDepartmentGroup.push(node);
		} else if (item.type === 6) {
			// 6 也应该加入到父节点的 children 中
			const parent = map[item.parentId];
			if (parent) {
				parent.children?.push(node);
			}
		} else if (item.type === 7) {
			majorGroup.push(node);
		} else if (item.type === 10) {
			classGroup.push(node);
		}
	});

	data.forEach((item) => {
		const current = map[item.id];
		if (item.type === 8) {
			const parent = map[item.parentId];
			if (parent && parent.children) {
				parent.children.push(current);
			}
		}
	});

	// 第五次遍历：添加一级子节点
	data.forEach((item) => {
		const current = map[item.id];
		if (item.type === 9) {
			const parent = map[item.parentId];
			if (parent && parent.children) {
				parent.children.push(current);
			}
		}
	});

	return {
		schoolDepartmentGroup,
		majorGroup,
		classGroup,
		courseGroup,
	};
}

export default transformData;
