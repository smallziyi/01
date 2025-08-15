<script lang="ts" setup>
import CloseSvg from '@/assets/icons/close.svg';
import { StudentEvaluate, StudentEvaluateDetail } from '@/view/classroom/type';
import { addTeachEvaluate, getStudentEvaluateTeachData } from '@/axios';
import { message } from 'ant-design-vue';
import useUserStore from '@/store/modules/useUserStore.ts';

const props = defineProps<{
	teachPlanId: string;
}>();
const { user } = useUserStore();
const open = defineModel('open', { required: true, type: Boolean });
const desc = ref<string[]>(['极差', '差', '一般', '好', '极好']);
const data = ref<StudentEvaluate>({
	teachPlanId: props.teachPlanId,
	studentId: user.value!.id,
	tableEvaluateDataList: [
		{
			tableType: 1,
			content: '',
			score: 0,
			createTime: '',
		},
		{
			tableType: 2,
			content: '',
			score: 0,
			createTime: '',
		},
		{
			tableType: 3,
			content: '',
			score: 0,
			createTime: '',
		},
		{
			tableType: 4,
			content: '',
			score: 0,
			createTime: '',
		},
		{
			tableType: 5,
			content: '',
			score: 0,
			createTime: '',
		},
		{
			tableType: 6,
			content: '',
			score: 0,
			createTime: '',
		},
	],
});

const dataDetail = ref<StudentEvaluateDetail>({
	contextName: '',
	studyName: '',
	taskName: '',
	workProcess: '',
	teacherName: '',
	totalTime: 0,
	stepName: '',
	createTime: '',
	tableEvaluateDataList: [],
});
const isDetail = ref<boolean>(false);
const handleSubmit = () => {
	addTeachEvaluate(data.value).then(() => {
		message.success('评教成功！');
		open.value = false;
	});
};
onMounted(() => {
	getStudentEvaluateTeachData(props.teachPlanId, user.value!.id).then((res) => {
		const { tableEvaluateDataList, ...rest } = res;
		dataDetail.value = {
			...dataDetail.value,
			...rest,
		};
		if (tableEvaluateDataList.length > 0) {
			isDetail.value = true;
			data.value.tableEvaluateDataList = tableEvaluateDataList;
		}
	});
});
</script>

<template>
	<a-drawer v-model:open="open" :close-icon="false" width="864px">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">学生评教</div>
				<div>
					<a-button type="link" @click="open = false">
						<template #icon>
							<CloseSvg />
						</template>
					</a-button>
				</div>
			</div>
		</template>
		<div class="drawer-title">评教内容</div>
		<table class="table-fixed w-full">
			<tbody>
				<tr>
					<td colspan="2" class="table-title">学习场</td>
					<td colspan="7">{{ dataDetail.studyName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习情境</td>
					<td colspan="7">{{ dataDetail.contextName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">学习任务</td>
					<td colspan="7">{{ dataDetail.taskName }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作过程描述</td>
					<td colspan="7">{{ dataDetail.workProcess }}</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">典型工作环节</td>
					<td colspan="3">{{ dataDetail.stepName }}</td>
					<td colspan="2" class="table-title">学时</td>
					<td colspan="2">{{ dataDetail.totalTime }} 学时</td>
				</tr>
				<tr>
					<td colspan="2" rowspan="7" class="table-title">调查项目</td>
					<td class="table-title">序号</td>
					<td colspan="2" class="table-title">调查内容</td>
					<td colspan="2" class="table-title">评价得分</td>
					<td colspan="2" class="table-title">改进建议</td>
				</tr>
				<tr v-for="(item, index) in data.tableEvaluateDataList" :key="index">
					<td class="table-title">{{ index + 1 }}</td>
					<td class="table-title" colspan="2">
						{{ ['资讯', '计划', '决策', '实施', '检查', '评价'][index] }}单的教学水平
					</td>
					<td colspan="2">
						<a-rate v-model:value="item.score" :tooltips="desc" :disabled="isDetail" allow-half />
					</td>
					<td colspan="2">
						<a-textarea
							v-model:value="item.content"
							placeholder="请填写"
							:auto-size="true"
							:bordered="false"
						></a-textarea>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="table-title">被评教教师姓名</td>
					<td colspan="3">{{ dataDetail.teacherName }}</td>
					<td colspan="2" class="table-title">评教日期</td>
					<td colspan="2">
						<template v-if="dataDetail.createTime">
							{{ $datetime.format(dataDetail.createTime, 'full') }}
						</template>
						<template v-else>提交时自动生成</template>
					</td>
				</tr>
			</tbody>
		</table>
		<template #footer>
			<div v-if="!isDetail" class="float-right">
				<a-button class="mr-4" @click="open = false">取消</a-button>
				<a-popconfirm
					placement="topRight"
					title="评教后内容不可修改，请认真评教哦！"
					ok-text="确定"
					cancel-text="取消"
					@confirm="handleSubmit"
				>
					<a-button type="primary">提交</a-button>
				</a-popconfirm>
			</div>
		</template>
	</a-drawer>
</template>

<style scoped>
table,
td {
	text-align: center;
	border-collapse: collapse;
	border: 1px solid #b4d3ff;
	line-height: 32px;
	padding: 0 8px;
	text-wrap: wrap;
}
.table-title {
	background-color: #EBF3FF;
}
</style>
