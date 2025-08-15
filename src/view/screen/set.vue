<script setup lang="ts">
// import ReportConfig from '@/view/screen/components/report-config.vue';
// import ScreenAdd from '@/view/screen/components/screen-add-edit.vue';
import ReportConfig from './screentemplate/screencofig/report-config.vue';
import ScreenAdd from './screentemplate/screencofig/screen-add-edit.vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import  { getscreenView, ScreenQuery, Screen, templateList, disabledList } from '@/axios';
const [list] = useAutoAnimate();

const modelParams = ref<ScreenQuery>({
	name: undefined,
	screenTemplate: undefined,
	disabled: undefined
})
const openAdd = ref<boolean>(false);
const cardDataList = ref<Array<Screen>>([])
const reset = () => {
	modelParams.value = {
		name: undefined,
		screenTemplate: undefined,
		disabled: undefined
	}
	screenData();
};

// 数据投屏列表
const screenData = () => {
	getscreenView(modelParams.value).then((res) => {
		cardDataList.value = res;
	})
}

onMounted(() => {
	screenData()
});

</script>

<template>
	<a-card size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<a-form :model="modelParams">
			<div class="grid grid-cols-4 gap-4">
				<a-form-item label="主题名称">
					<a-input v-model:value="modelParams.name" placeholder="请输入"></a-input>
				</a-form-item>
				<a-form-item label="投屏模板">
					<a-select v-model:value="modelParams.screenTemplate" :options="templateList" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item label="启用状态">
					<a-select v-model:value="modelParams.disabled" :options="disabledList" placeholder="请选择"></a-select>
				</a-form-item>
				<a-form-item>
					<div class="text-right">
						<a-button class="mr-4" @click="reset">重置</a-button>
						<a-button type="primary" @click="screenData">查询</a-button>
					</div>
				</a-form-item>
			</div>
		</a-form>
	</a-card>
	<a-card size="small" :body-style="{ padding: '16px' }" :bordered="false" style="min-height: calc(100vh - 253px)">
		<template #title>
			<div class="flex flex-col">
				<div class="card-title">
					数据投屏设置列表
				</div>
			</div>
		</template>
		<template #extra>
			<a-button type="link" @click="openAdd = true"><i class="bi bi-plus-circle mr-1" />新建</a-button>
		</template>
		<div style="height: calc(100vh - 270px)" class="overflow-y-auto">
			<template v-if="cardDataList.length > 0">
				<div ref="list" class="card-layout">
					<report-config 
						v-for="item in cardDataList"
						:item="item" 
						:key="item.id" 
						@update="screenData"
					/>
				</div>
			</template>
			<template v-else>
				<m-empty></m-empty>
			</template>
		</div>
	</a-card>
	<screen-add
		v-if="openAdd"
		v-model:open="openAdd"
		type="add"
		@success="screenData"
	/>
</template>
<style scoped>
:deep(.ant-form-item) {
	margin-bottom: 0;
}
</style>
