import useUserStore from '@/store/modules/useUserStore.ts';

export type College = {
	clientId: string;
	name: string;
	phone: string;
	leaderId?: string;
	description: string;
	disable: boolean;
	foundingTime: string;
	leaderName: string;
	leaderPhone: string;
	domainData: string[];
} & BaseEntity;

export const initCollege = (): College => {
	const { user } = useUserStore();
	return {
		clientId: user.value!.clientId,
		createBy: user.value!.id,
		createTime: '',
		createUser: user.value!.name,
		description: '',
		disable: false,
		domainData: [],
		foundingTime: '',
		id: '',
		lastUpdateTime: '',
		leaderId: undefined,
		leaderName: '',
		leaderPhone: '',
		name: '',
		phone: '',
	};
};

export type QueryCollegeParam = {
	name?: string;
	domainId?: string;
	disable?: number;
};

export const initQueryCollegeParams = (): QueryCollegeParam => {
	return {
		name: undefined,
		domainId: undefined,
		disable: undefined,
	};
};

export type formCollegeParams = {
	clientId?: string;
	collegeId: string;
	name: string;
	district: string | undefined;
	leaderId?: string;
	leaderName: string;
	description: string;
	disable: boolean;
};
