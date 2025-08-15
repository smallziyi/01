import { http } from '@/axios';
import { Occupation } from '@/view/base/code/occupation/config.ts';
import { Certificate } from '@/view/base/code/certificate/config.ts';
import { Industry } from '@/view/base/code/industry/config.ts';
import { Major } from '@/view/base/code/major/config.ts';
import { Post } from '@/view/base/code/post/config.ts';
import { Permission } from '@/view/base/permission/config.ts';
import { UserTypeQuery } from '@/view/base/user/schoolUser.ts';
import { UserQueryParams } from '@/view/cloud/user/config.ts';
import { QueryCertificateParams } from '@/view/cloud/certificate/config.ts';
import { QueryParams } from '@/view/cloud/industry/config.ts';
import { CreateRole, Role } from '@/view/cloud/role/config.ts';

/**
 * 登陆
 * @param account 账号
 * @param password 密码
 * @param rememberMe 是否记住我
 * @return User 用户信息
 * */
export async function login(account: string, password: string, rememberMe?: boolean) {
	const response = await http.post<User>('/base/auth/login', { account, password });
	sessionStorage.setItem('jwt', response.headers['authorization']);
	if (rememberMe) {
		localStorage.setItem('login_form', JSON.stringify({ account, password }));
	} else {
		localStorage.removeItem('login_form');
	}
	return response.data;
}

/**
 * 获取菜单权限
 * @param roleId 登陆角色ID
 * @return Array<Permission> 权限列表
 * */
export async function getRolePermission(roleId: string) {
	return (await http.get<Array<Permission>>('/base/auth/getRolePermission', { params: { roleId } })).data;
}

/**
 * 获取登录用户信息
 * @return UserRes 用户信息
 */
export async function getUserInfo() {
	return (await http.get<User>('/base/auth/getLoginUserInfo')).data;
}
/**
 * 获取登录用户权限
 * @return UserRes 用户信息
 */
export async function getLoginUserPermission() {
	return (await http.get<Permission[]>('/base/auth/getLoginUserPermission')).data;
}

/**
 * 退出登录
 */
export async function logout() {
	return http.delete('/base/auth/logout').then(() => {
		sessionStorage.removeItem('jwt');
	});
}

/**
 * 密码校验
 * @param data {userId: '用户ID',password: '密码'}
 * @return boolean 密码是否正确
 * */
export async function checkPassword(data: { userId: string; password: string }) {
	return (await http.post<boolean>('/base/auth/checkPassword', data)).data;
}

/**
 * 修改密码
 * @param data {userId: '用户ID',destPassword: '新密码'}
 * */
export async function updatePassword(data: { userId: string; destPassword: string }) {
	return await http.put('/base/auth/updatePassword', data);
}

/**
 * 获取职业大典目录
 * @return Array<Occupation> 职业大典目录树列表
 * */
export async function getOccupationList() {
	return (await http.get<Occupation[]>('/base/code/occupation/getOccupationTree')).data;
}

/**
 * 获取资格证书列表
 * @return Array<Certificate> 资格证书列表
 * */
export async function getCertificateList() {
	return (await http.get<Certificate[]>('/base/code/certificate')).data;
}

/**
 * 获取行业分类列表
 * @return Array<Industry> 行业分类列表
 * */
export async function getIndustryTree() {
	return await http.get<Industry[]>('/base/code/industry/getIndustryTree');
}

/**
 * 获取专业列表
 * @return Array<Major> 专业列表
 * */
export async function getMajorList() {
	return http.get<Major[]>('/base/code/major/getMajorTree');
}

/**
 * 获取岗位列表
 * @return Array<Major> 岗位列表
 * */
export async function getPostTree() {
	return (await http.get<Post[]>('/base/code/position/getPositionTree')).data;
}

/**
 * 获取权限列表
 * @param params { type?: '类型'; clientId?: '客户端ID' }
 * @return Permission[] 权限列表
 * */
export async function getPermissionList(params: { type?: number; clientId?: string }) {
	return await http.get<Permission[]>('/base/permission/queryMenuTree', { params });
}

/**
 * 创建权限
 * @param permission 权限实体
 * @return Permission 权限实体
 * */
export async function createPermission(permission: Partial<Permission>) {
	return await http.post<Permission>('/base/permission', permission);
}

/**
 * 批量更新权限
 * @param permissions 权限实体列表
 * */
export async function updatePermissions(permissions: Array<Permission>) {
	return await http.put('/base/permission/updatePermissionBatch', permissions);
}

/**
 *更新权限
 * @param permission 权限实体
 * */
export async function updatePermission(permission: Permission) {
	return await http.put('/base/permission', permission);
}

/**
 * 获取权限选项列表
 * @return Array<Option> 选项列表
 * */
export async function getDropPermissionType() {
	return (await http.get<Option[]>('/base/permission/dropPermissionType')).data;
}

/**
 * 获取学校用户列表
 * @param params 查询条件
 * @return Page<User> 用户分页列表
 * */
export async function fetchSchoolUserList(params: UserTypeQuery) {
	return (await http.get<Page<User>>('/base/user', { params })).data;
}

export const addSchoolUser = async (user: User) => {
	return await http.post<User>('/base/user', user);
};

export const updateUserDisable = async (data: { userIds: Array<string>; disable: boolean }) => {
	return await http.put('/base/user/disable', data);
};

/**
 * 获取用户列表
 * @param params 查询条件
 * @return Page<User> 用户分页列表
 * */
export const fetchUserList = async (params: UserQueryParams) => {
	return (await http.get<Page<User>>('/base/user', { params })).data;
};

/**
 * 批量修改用户状态
 * @params {userIds: '用户IDs'，disable： ‘要修改的状态’}
 * */
export const updateDisable = async (params: { userIds: string[]; disable: boolean }) => {
	return await http.put('/base/user/disable', params);
};

/**
 * 添加用户
 * @param params 用户实体
 * @return User 用户实体
 * */
export const addUser = async (params: User) => {
	return await http.post<User>('/base/user', params);
};

/**
 * 获取客户端角色下拉
 * @param clientId 客户端Id
 * @return Array<Option> 角色下拉
 * */
export const fetchUserDrop = async (clientId: string) => {
	return (await http.get<Option[]>('/base/role/dropOptions', { params: { clientId } })).data;
};

/**
 * 更新用户信息
 * @param user 用户实体
 * @return User 用户实体
 * */
export const updateUser = async (user: User) => {
	return (await http.put('/base/user', user)).data;
};

// 更新用户头像
export const updateUserAvatar = async (userId: string, avatarId: string) => {
	return (await http.put<User>(`/base/user/updateUserAvatar/${userId}/${avatarId}`)).data;
};

/**
 * 获取用户信息
 * @param userId 用户Id
 * @return User 用户实体
 * */
export const getUserInfoById = (userId: string) => {
	return http.get<User>('/base/user/getUserDetails', { params: { userId } });
};

/**
 * 获取资格证书列表
 * @param params QueryCertificateParams 查询条件
 * @return Page<Certificate> 资格证书分页列表
 * */
export const fetchCertificateList = async (params: QueryCertificateParams) => {
	return (await http.get<Page<Certificate>>('/base/code/certificate', { params: params })).data;
};

/**
 * 更新资格证书状态
 * @param id 资格证书Id
 * */
export const updateCertificateStatus = async (id: string) => {
	return await http.put(`/base/code/certificate/${id}/disable`);
};

/**
 * 记录用户点击菜单
 * */
export function clickMenu(permissionId: string) {
	http.post(`/base/access/${permissionId}`);
}

// 获取中国地址树
export const getAddressTree = async () => {
	return (await http.get('base/dictionary/getAddressTree')).data;
};

export const getDictionaryOptions = async (dictionaryIds: Array<number>) => {
	return (
		await http.get<{ [key: number]: Array<Option> }>('/base/dictionary/batchDropOptions', { params: { dictionaryIds } })
	).data;
};

export const fetchIndustryList = async (queryParams: QueryParams) => {
	return (await http.get<Page<Industry>>('/base/code/industry', { params: queryParams })).data;
};

export const fetchRoleList = async (params: { clientId: string }) => {
	return (await http.get<Array<Role>>('/base/role/getRoleList', { params })).data;
};

export const saveRole = async (data: CreateRole) => {
	return await http.post('/base/role', data);
};

export const fetchRoleDrop = async (clientId: string, codes?: Array<string>) => {
	return (await http.get<Option[]>('/base/role/dropOptions', { params: { clientId, codes } })).data;
};
