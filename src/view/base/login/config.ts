export type LoginInfo = {
	account: string;
	password: string;
	phone?: string;
	code?: string;
	checked?: boolean;
};

export type Menu = {
	name: string;
	code: string;
	children?: Menu[];
	icon: string;
	type: number;
};

/* 登录接口参数类型 */
export interface LoginData {
	account: string;
	password: string;
}

export interface UserRes {
	userId?: string;
	name: string;
	avatar: string;
	buttons: string[];
	roles: string[];
	routes: string[];
}

/** 用户权限数据类型 */
export interface AuthInfo {
	buttons: string[];
	roles: string[];
	routes: string[];
}

/* 用户信息接口返回值类型 */
export interface UserInfo {
	userId?: string;
	name: string;
	avatar: string;
}

export interface MenuOptions {
	path: string;
	name: string;
	component?: string | (() => Promise<any>);
	redirect?: string;
	meta: MetaProps;
	children?: MenuOptions[];
}
export interface MetaProps {
	title: string;
	icon: string;
	name: string;
	activeMenu?: string;
	isLink?: string;
	isHide: boolean;
	isFull: boolean;
	isAffix: boolean;
	isKeepAlive: boolean;
}
