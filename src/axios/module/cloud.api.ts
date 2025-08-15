import { http } from '@/axios';

import { Client, QueryClientParams } from '@/view/cloud/client/config.ts';
import { Permission } from '@/view/base/permission/config.ts';
import { Contract, QueryContractParams } from '@/view/cloud/contract/config.ts';
import { Brokerage } from '@/view/cloud/brokerage/config.ts';
import { Settle } from '@/view/cloud/settle/config.ts';
import { Expense, QueryExpenseParams } from '@/view/cloud/expense/config.ts';
import { QuerySalesmanParams, Salesman } from '@/view/cloud/salesman/config.ts';

export const fetchClientList = async (params: QueryClientParams): Promise<Page<Client>> => {
	const response = await http.get<Page<Client>>('/cloud/client', { params });
	return response.data;
};

export const saveClient = (client: Client) => {
	return http.post<User>('/cloud/client', client);
};

export const setClient = (client: Client) => {
	return http.post('/cloud/client/setClientAdmin', client);
};

export const getClientDetail = async (clientId: string) => {
	return (await http.get<Client>('/cloud/client/getClientAdmin', { params: { clientId } })).data;
};

export const getAllClientOptions = async () => {
	return (await http.get<Option[]>('/cloud/client/dropClientInfo')).data;
};

export const queryClientMenuTree = async (clientId: string) => {
	return (await http.get<Permission[]>('/cloud/client/queryClientMenuTree', { params: { clientId } })).data;
};

export const updateClientPermission = async (clientId: string, permissionIds: Array<Key>) => {
	return await http.put('/cloud/client/updateClientPermission', { clientId, permissionIds });
};

export const getClientPermission = async (clientId: string) => {
	return (await http.get<string[]>('/cloud/client/getClientPermission', { params: { clientId } })).data;
};

export const fetchContractList = async (params: QueryContractParams): Promise<Page<Contract>> => {
	const response = await http.get<Page<Contract>>('/cloud/contract', { params });
	return response.data;
};

export const getContractById = async (id: string) => {
	return (await http.get<Contract>(`/cloud/contract/${id}`)).data;
};

export const createContract = (contract: Contract) => {
	return http.post('/cloud/contract', contract);
};

export const getContractListByClientId = async (clientId: string) => {
	return await http.get<Contract[]>('/cloud/contract/getContractByClientId', { params: { clientId } });
};

export const getContractListBySalesmanId = async (salesmanId: string) => {
	return await http.get<Contract[]>('/cloud/contract/getContractBySalesmanId', { params: { salesmanId } });
};

export const fetchBrokerageList = async (params: QueryClientParams) => {
	const response = await http.get<Page<Brokerage>>('/cloud/brokerage', { params });
	return response.data;
};

export const getSettleListByBrokerageId = async (brokerageId: string) => {
	return await http.get<Settle[]>('/cloud/settle/getSettleListByBrokerageId', { params: { brokerageId } });
};

export const saveSettle = async (settle: Settle) => {
	return await http.post('/cloud/settle', settle);
};

export const fetchExpenseList = async (params: QueryExpenseParams): Promise<Page<Expense>> => {
	const response = await http.get<Page<Expense>>('/cloud/expense', { params });
	return response.data;
};

export const saveExpense = (expense: Expense) => {
	return http.post('/cloud/expense', expense);
};

export const getExpenseByContractId = async (contractId: string) => {
	return await http.get<Expense[]>('/cloud/expense/getExpenseListByContractId', { params: { contractId } });
};

export const getSalesmanOptions = async () => {
	return (await http.get<Option[]>('/cloud/salesman/getAll')).data;
};

export const saveSalesman = (salesman: Salesman) => {
	return http.post('/cloud/salesman', salesman);
};

export const fetchSalesmanList = async (params: QuerySalesmanParams): Promise<Page<Salesman>> => {
	const response = await http.get<Page<Salesman>>('/cloud/salesman', { params });
	return response.data;
};
