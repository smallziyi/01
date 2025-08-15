<script setup lang="ts">
import * as xlsx from 'xlsx';
import { message } from 'ant-design-vue';
import { ReportTable } from '@/view/__report';
import { getReportTable, saveSurveyTable } from '@/axios';
import useUserStore from '@/store/modules/useUserStore.ts';
// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const props = defineProps<{
	sort: number;
	reportId: string;
	menuId: string;
	reset: boolean;
	type: string;
	tableId?: string;
}>();
const upload = defineModel<boolean>('upload', { required: true });
const emit = defineEmits(['success', 'fail']);

const input = ref<HTMLInputElement>();
const content = ref<HTMLDivElement>();

const handleInputFile = async () => {
	let fileId = '';
	const file = input.value?.files![0];
	table.value!.name = file!.name.split('.').slice(0, -1).join('.');
	const reader = new FileReader();
	reader.readAsArrayBuffer(file!);
	reader.onload = (e) => {
		const workBook = xlsx.read(e.target!.result);
		const data = workBook.Sheets[workBook.SheetNames[0]];
		content.value!.innerHTML = xlsx.utils.sheet_to_html(data, { header: '', footer: '' });
		const parser = new DOMParser();
		const tableXML = parser.parseFromString(content.value?.innerHTML!, 'text/html');
		const result: TableData = [];
		tableXML.querySelectorAll('table').forEach((table) => {
			const trs = table.querySelectorAll('tr');
			for (let i = 0; i < trs.length; i++) {
				result[i] = [];
				trs[i].querySelectorAll('td').forEach((td) => {
					result[i].push({
						value: getInnerTextWithFormat(td),
						colspan: td.colSpan,
						rowspan: td.rowSpan,
						id: snowyflake.nextId().toString(),
					});
				});
			}
		});
		table.value!.tableData = result;
		table.value!.fileId = fileId;
		saveSurveyTable(table.value!)
			.then((res) => {
				message.success('上传完成');
				emit('success', { value: res.id, label: res.name });
			})
			.finally(() => {
				upload.value = false;
			});
	};
};

const { user } = useUserStore();
const initTable = (): ReportTable<TableData> => {
	return {
		reportId: props.reportId,
		menuId: props.menuId,
		name: '',
		number: '',
		type: props.type,
		tableData: [],
		sort: props.sort,
		id: '',
		createBy: user.value!.id,
		createUser: user.value!.name,
		createTime: '',
		lastUpdateTime: '',
	};
};
const table = ref<ReportTable<TableData>>();

onMounted(() => {
	input.value?.click();
	if (props.reset) {
		getReportTable<TableData>({ tableId: props.tableId! }).then((res) => {
			table.value = res;
		});
	} else {
		table.value = initTable();
	}
});

function getInnerTextWithFormat(element: HTMLTableCellElement) {
	let htmlContent = element.innerHTML;
	htmlContent = htmlContent.replace(/<br\s*\/?>/gi, '\n');
	htmlContent = htmlContent.replace(/&nbsp;/g, ' ');
	let tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlContent;
	let innerText = tempDiv.innerText;
	innerText = innerText.replace(/ {2}/g, ' ');
	return innerText;
}
</script>

<template>
	<input ref="input" type="file" class="hidden" accept=".xlsx" @cancel="upload = false" @input="handleInputFile" />
	<div ref="content" class="hidden"></div>
</template>
