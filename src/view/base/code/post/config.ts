export type Post = {
	name: string;
	code: string;
	parentCode: string;
	description: string;
	disable: boolean;
	children?: Post[];
} & BaseEntity;
