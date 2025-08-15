export type Occupation = {
	name: string;
	code: string;
	parentCode: string;
	disable: boolean;
	description: string;
	label: string;
	value: string;
} & BaseEntity;
