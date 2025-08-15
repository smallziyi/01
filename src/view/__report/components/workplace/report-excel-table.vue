<script setup lang="ts">
import security from '@/utils/security.ts';
import emitter from '@/utils/event.ts';
import { onClickOutside, useStorage } from '@vueuse/core';

const tableData = defineModel<TableData>('tableData', { required: true });
const errorCells = defineModel<Array<string>>('errorCells', { required: true });

const router = useRouter();

const params = security.base64Decode<{ reportId: string; type: 'edit' | 'audit' }>(
	router.currentRoute.value.query.v as string,
);
const addComment = useStorage<boolean>('addComment', false);

const editingTd = ref<{ row: number; col: number } | null>(null);

const selectTd = (row: number, col: number) => {
	errorCells.value = [];
	editingTd.value = { row, col };
};

const hasFocus = ref(false);
const keyEvent = (event: KeyboardEvent) => {
	if (hasFocus.value) {
		const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
		if (((isMac && event.metaKey) || (!isMac && event.ctrlKey)) && event.key === 's') {
			event.preventDefault();
			emits('update');
		}
	}
};
onMounted(() => {
	document.addEventListener('keydown', keyEvent);
});
onUnmounted(() => {
	document.removeEventListener('keydown', keyEvent);
});
const handleFocus = () => {
	hasFocus.value = true;
};
const handleBlur = () => {
	hasFocus.value = false;
};

const emits = defineEmits(['update']);

const handleContentChange = (event: Event) => {
	tableData.value[editingTd.value?.row!][editingTd.value?.col!].value = (event.target as HTMLPreElement).innerText;
};

const selectCell = ref<Array<string>>([]);
const handleClickCell = (cellId: string) => {
	if (params.type === 'edit') return;
	if (params.type === 'audit') {
		errorCells.value = [];
	}
	if (selectCell.value.includes(cellId)) {
		selectCell.value = selectCell.value.filter((_cell) => _cell !== cellId);
	} else {
		selectCell.value.push(cellId);
	}
};
const table = ref();
onClickOutside(table, (e: Event) => {
	const target = e.target as HTMLPreElement;
	if (target.id === 'commentButton' || addComment.value) {
		return;
	} else {
		selectCell.value = [];
	}
});
</script>

<template>
	<slot></slot>
	<a-dropdown :trigger="['contextmenu']">
		<table class="w-full table-fixed" ref="table">
			<tbody>
				<template v-for="(tr, rowIndex) in tableData">
					<tr>
						<template v-for="(td, colIndex) in tr">
							<td
								@dblclick="handleClickCell(td.id)"
								:colspan="td.colspan"
								:rowspan="td.rowspan"
								:class="[
									selectCell.includes(td.id) && params.type === 'audit' ? 'bg-orange-200' : '',
									errorCells.includes(td.id) ? 'bg-orange-200' : '',
								]"
							>
								<pre
									@click="selectTd(rowIndex, colIndex)"
									:id="`${td.id}`"
									:contenteditable="params.type === 'edit'"
									class="focus-visible:outline-none text-wrap"
									@focus="handleFocus"
									@blur="handleBlur"
									@input="handleContentChange"
									>{{ td.value }}</pre
								>
							</td>
						</template>
					</tr>
				</template>
			</tbody>
		</table>
		<template #overlay>
			<a-menu v-if="params.type === 'audit'">
				<a-menu-item key="1">
					<div id="commentButton" @click="emitter.emit('report_table_add_comment', selectCell)">添加批注</div>
				</a-menu-item>
			</a-menu>
		</template>
	</a-dropdown>
</template>

<style scoped>
table,
td {
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	padding: 0 8px;
}
</style>
