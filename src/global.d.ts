import { ColumnsType, ColumnType } from 'ant-design-vue/es/table/interface';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { Menu } from '@/view/base/login/config.ts';
import datetime from '@/utils/datetime.ts';
import security from '@/utils/security.ts';
import tree from '@/utils/tree.ts';
import emitter from '@/utils/event.ts';
import download from '@/utils/download.ts';
import { ReportTable } from '@/view/__report';

declare module 'uuid';

declare module 'vue' {
	interface ComponentCustomProperties {
		$datetime: typeof datetime;
		$security: typeof security;
		$tree: typeof tree;
		$emitter: typeof emitter;
		$download: typeof download;
		$reload: () => void;
		$config: { api: string; file: string; clientPage: ClientPageType };
	}
}
declare global {
	type User = {
		clientId: string;
		clientName: string;
		name: string;
		number: string;
		phone: string;
		birthday: string;
		gender: number | undefined;
		email: string;
		idCard: string;
		nativePlace: string;
		address: string;
		avatarId: string;
		avatarUrl?: string;
		authAccount?: string;
		groupId?: string;
		disable: boolean;
		roleName?: string;
		roleList: {
			id: string;
			name: string;
			code: string;
			menuTreeData: Menu[];
			interfaceData: [{ name: string; code: string }];
		}[];
		permissions: string[];
		roleIds?: string[];
		roleCode: string;
		roleNameArray?: string;
		formatAddress?: string[];
	} & BaseEntity;
	type BaseEntity = {
		id: string;
		createBy: string;
		createUser: string;
		createTime: string;
		lastUpdateTime: string;
	};
	type Page<T> = {
		records: T[];
		totalRow: number | string;
		totalPage: number | string;
		pageNumber: number | string;
		pageSize: number | string;
	};
	type Option = { label: string; value: string | number; children?: Option[] };
	type IFile = {
		fileName: string;
		size: number;
		contentType: string;
		originalFileName: string;
		platform: string;
		md5: string;
		url: string;
	} & BaseEntity;
	type TableRow<T> = {
		text: any;
		value: any;
		record: Record<string, any>;
		index: number;
		column: ColumnType<T>;
	};
	type TableColumns<T> = ColumnsType<T>;
	type Key = string | number;
	type FormError = ValidateErrorEntity;
	type Tree = {
		id: string;
		parentId: string;
		label: string;
		name?: string;
		display: boolean;
		type?: string;
		children?: Tree[];
		fileName?: string;
		fileTemplateUrl?: string;
		fileId?: string;
		editedFlag?: boolean;
		tableDataFlag?: boolean;
		tableAllAuditStatus: 1 | 2 | 3;
		tableEditStatus: 1 | 2 | 3;
		tableAuditStatus: 1 | 2 | 3;
		data: Array<ReportTable>;
		level: number;
		tableFormData?: {
			0: Array<{ taskName: string; taskContent: string }>;
			1: Array<{ taskName: string; taskContent: string }>;
			2: Array<{ taskName: string; taskContent: string }>;
			3: Array<{ taskName: string; taskContent: string }>;
			4: Array<{ taskName: string; taskContent: string }>;
			5: Array<{ taskName: string; taskContent: string }>;
			6: Array<{ taskName: string; taskContent: string }>;
		};
		occupationQuality?: {
			task: string;
			workMethod: string;
			workObject: string;
			tool: string;
			ethics: string;
			workOrganization: string;
			targetValue: string;
			product: string;
		}[];
		// 教师用书
		teachPlanDataList?: {
			teachPlanId: string;
			//授课日期
			teachDate: string;
			//授课老师名称
			teacherName: string;
			//时间段名称
			timeSlotName: string;
			//时间段
			startTime: string;
			endTime: string;
		}[];
		questionData: Array<string>;
	};
	type TableData = Array<Array<TableDataItem>>;
	type TableDataItem = { value: string; colspan: number; rowspan: number; id: string };
	type DictionaryOption = Record<number, Array<Option>>;
	// 0: 开发者  1:准格尔旗 2: 吉林铁道  3: 中山 4: 鄂尔多斯
	type ClientPageType = '0' | '1' | '2' | '3' | '4';
	interface Window {
		config: { api: string; file: string; clientPage: ClientPageType; wsUrl: string };
	}
	interface TreeNode {
		id: string;
		level: number;
		name: string;
		children: TreeNode[];
		disabled: boolean;
	}
}

export {};

import 'vue-router';

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {};

declare module 'vue-router' {
	interface RouteMeta {
		isHide?: boolean;
		title: string;
		icon?: string;
	}
}
declare module '@vue-office/docx/lib/v3/vue-office-docx.mjs' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<Record<string, any>, {}, any>;
	export default component;
}
