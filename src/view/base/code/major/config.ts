export type Major = {
	name: string;
	code: string;
	parentCode: string;
	disable: boolean;
	children: Major[];
	label: string;
	value: string;
	majorId: string;
} & BaseEntity;
