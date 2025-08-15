// export interface Node {
// 	id: number;
// 	name: string;
// 	children: Node[];
// }
import { Permission } from '@/view/base/permission/config.ts';

export interface MappedNode {
	key: string;
	title: string;
	children?: MappedNode[]; // 将 children 属性定义为 MappedNode[] 类型
}

export const mapData = (data: Permission[]): MappedNode[] => {
	// 返回值类型更改为 MappedNode[]
	return data.map((node) => {
		const mappedNode: MappedNode = {
			key: node.id,
			title: node.name,
		};
		if (node.children && node.children.length > 0) {
			mappedNode.children = mapData(node.children);
		}
		return mappedNode;
	});
};
