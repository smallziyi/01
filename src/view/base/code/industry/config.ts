export type Industry = {
	name: string;
	code: string;
	parentCode: string;
	description: string;
	childrenFlag: string;
	disable: boolean;
	value: string;
	label: string;
	children: Industry[];
} & BaseEntity;
