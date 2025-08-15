export type Certificate = {
	name: string;
	code: string;
	parentCode: string;
	disable: boolean;
	description: string;
	label: string;
	value: string;
	type: number | undefined;
} & BaseEntity;
