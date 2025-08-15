const tree = {
	listToTree: <T>(
		list: any[],
		idField: string = 'id',
		parentIdField: string = 'parentId',
		childrenField: string = 'children',
	): T[] => {
		list.forEach((item) => {
			if (item[childrenField]) {
				item[childrenField] = [];
			}
		});
		const map: { [key: string]: any } = {};
		const roots: T[] = [];

		for (const node of list) {
			map[node[idField]] = { ...node };
		}
		for (const node of list) {
			if (node[parentIdField] === null || !map[node[parentIdField]]) {
				roots.push(map[node[idField]]);
			} else {
				map[node[parentIdField]][childrenField] = map[node[parentIdField]][childrenField] || [];
				map[node[parentIdField]][childrenField].push(map[node[idField]]);
			}
		}

		return roots;
	},

	treeToList: <T>(tree: any[], childrenField: string = 'children', withChildren: boolean = false): T[] => {
		const list: T[] = [];

		const traverse = (node: any) => {
			let { [childrenField]: _, ...nodeWithoutChildren } = node;
			list.push(withChildren ? node : nodeWithoutChildren);
			if (node[childrenField]) {
				for (const child of node[childrenField]) {
					traverse(child);
				}
			}
		};

		for (const root of tree) {
			traverse(root);
		}

		return list;
	},
	groupByLevel: (root: TreeNode): { name: string; leafCount: number }[][] => {
		let queue: TreeNode[] = [root]; // 初始化队列，开始时只包含根节点
		let result: { name: string; leafCount: number }[][] = []; // 结果列表

		while (queue.length > 0) {
			let nextQueue: TreeNode[] = []; // 下一层的队列
			let currentLevel: { name: string; leafCount: number }[] = []; // 当前层的节点列表

			// 遍历当前层的每一个节点
			for (let node of queue) {
				// 将当前节点的子节点添加到下一层的队列中
				if (node.children) {
					nextQueue.push(...node.children);
				}
				// 将当前节点添加到当前层的列表中
				currentLevel.push({ name: node.name, leafCount: countLeafNodes(node) });
			}

			// 将当前层的列表添加到结果列表中
			result.push(currentLevel);

			// 进入下一层
			queue = nextQueue;
		}

		return result;
	},
	toRow: (node: TreeNode | undefined) => {
		const result: any[] = [];
		let nodeList: TreeNode[] = [];
		const preOrderTraversal = (node: TreeNode | undefined) => {
			if (node) {
				nodeList.push({ name: node.name, leafCount: countLeafNodes(node) });
				if (node.children) {
					for (let child of node.children) {
						preOrderTraversal(child);
					}
				} else {
					result.push(nodeList);
					nodeList = [];
				}
			}
		};
		preOrderTraversal(node);
		return result;
	},
};

export interface TreeNode {
	name: string;
	children?: TreeNode[];
	leafCount?: number;
}

const countLeafNodes = (node: TreeNode): number => {
	if (!node.children || node.children.length === 0) {
		node.leafCount = 0;
	} else {
		let leafCount = 0;
		for (let child of node.children) {
			leafCount += countLeafNodes(child);
		}
		if (node.children.every((child: TreeNode) => !child.children || child.children.length === 0)) {
			leafCount += node.children.length;
		}
		node.leafCount = leafCount;
	}
	return node.leafCount;
};
export default tree;
