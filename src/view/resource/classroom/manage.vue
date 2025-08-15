<script setup lang="ts">
import { getClassroomList, getDropManagerList } from '@/axios';
import {
	Classroom,
	ClassroomQuery,
	sourceOption,
	natureOption,
	typeOption,
	disableOption,
	constructStatusOption,
} from './config';
import cardItem from './components/card-item.vue';
import classroomAdd from './components/classroom-add.vue';
import usePage from '@/hooks/usePage';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';

const { dictionaryOption } = useDictionaryStore();

const cardDataList = ref<Classroom[]>([]);
const queryFormModel = ref<ClassroomQuery>({});
const mangerOption = ref<Option[]>([]);
const { state, onCreate } = usePage();
const [list] = useAutoAnimate();

const reset = () => {
	queryFormModel.value = {};
	search();
};
const search = () => {
	getClassroomList(queryFormModel.value).then((res) => {
		cardDataList.value = res;
	});
};

const fetchManagerOption = () => {
	getDropManagerList().then((res) => {
		mangerOption.value = res;
	});
};

const refreshData = () => {
	search();
	fetchManagerOption();
};

const queryNature = computed(() => {
	const currentSource = queryFormModel.value.source;
	return currentSource === 1 ? natureOption.slice(0, 3) : currentSource === 2 ? natureOption.slice(3) : natureOption;
});

onMounted(async () => {
	refreshData();
});
</script>

<template>
	<a-card :body-style="{ padding: '16px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form ref="form" :model="queryFormModel" class="w-full" :labelCol="{ style: { width: '100px' } }">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item label="实训基地名称" name="name">
					<a-input v-model:value="queryFormModel.name" placeholder="请输入" />
				</a-form-item>
				<a-form-item label="实训基地归属" name="source">
					<a-select v-model:value="queryFormModel.source" :options="sourceOption" placeholder="请输入"></a-select>
				</a-form-item>
				<a-form-item label="实训基地性质" name="typeDictionaryId">
					<a-select
						v-model:value="queryFormModel.typeDictionaryId"
						:options="queryNature"
						placeholder="请输入"
					></a-select>
				</a-form-item>
				<a-form-item label="实训基地类型" name="type">
					<a-select v-model:value="queryFormModel.type" :options="typeOption" placeholder="请输入"></a-select>
				</a-form-item>
				<a-form-item label="启用状态" name="disable">
					<a-select v-model:value="queryFormModel.disable" :options="disableOption" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item label="建设状态" name="domainId">
					<a-select
						v-model:value="queryFormModel.constructStatus"
						:options="constructStatusOption"
						placeholder="请选择"
					></a-select>
				</a-form-item>
				<a-form-item label="责任人" name="mer">
					<a-select v-model:value="queryFormModel.mangerId" :options="mangerOption" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item class="text-right">
					<a-button class="mr-4" @click="reset">重置</a-button>
					<a-button type="primary" @click="search">查询</a-button>
				</a-form-item>
			</div>
		</a-form>
	</a-card>
	<a-card size="small" :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="card-title">实训基地列表</div>
		</template>
		<template #extra>
			<a-button type="link" @click="onCreate"><i class="bi bi-plus-circle mr-1" />新建</a-button>
		</template>
		<div style="height: calc(100vh - 323px)" class="overflow-y-auto">
			<template v-if="cardDataList.length > 0 && dictionaryOption">
				<div ref="list" class="card-layout">
					<card-item
						v-for="item in cardDataList"
						:key="item.id"
						:card-item="item"
						:manger-option="mangerOption"
						@update="refreshData"
					/>
				</div>
			</template>
			<template v-else>
				<m-empty></m-empty>
			</template>
		</div>
	</a-card>
	<classroom-add v-if="state.createOpen" v-model:open="state.createOpen" @refresh="refreshData" />
</template>

<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
