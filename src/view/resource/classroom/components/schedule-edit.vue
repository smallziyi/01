<script setup lang="ts">
import { getClassroomScheduleDetails, getAdjustCourseClassRoomList, updateTeachPlanClassroom } from '@/axios';
import { translationValue, translationKey } from '@/utils/dictionary';
import {
	Classroom,
	constructStatusOption,
	natureOption,
	sourceOption,
	typeOption,
	CourseArrangement,
	courseArrangementColumns,
} from '../config';
import closeSvg from '@/assets/icons/close.svg';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';
import { message } from 'ant-design-vue';

const { dictionaryOption } = useDictionaryStore();

const props = defineProps<{
	classroomId: string;
	teachDate: string;
}>();
const open = defineModel('open', { required: true, type: Boolean });
const classroomData = ref<Classroom>();
const courseData = ref<CourseArrangement[]>([]);
// const otherData = ref<OtherArrangement[]>([])

// const editableData: UnwrapRef<Record<string, OtherArrangement>> = reactive({});
// const edit = (key: string) => {
//   editableData[key] = _.cloneDeep(otherData.value.filter(item => key === item.key)[0]);
// };
// const save = (key: string) => {
//   Object.assign(otherData.value.filter(item => key === item.key)[0], editableData[key]);
//   delete editableData[key];
// };
// const cancel = (key: string) => {
//   delete editableData[key];
// };
// const handleAdd = () => {
//   otherData.value.push({
//     key: snowyflake.nextId().toString(),
//     item: '',
//     startTime: '00:00:00',
//     endTime: '00:00:00',
//     description: ''
//   })
// }
// const handleDelete = (id: string) => {
//   otherData.value = otherData.value.filter((item) => item.key !== id)
// }
const showSelected = ref(false);
const currentId = ref('');
const classroomOption = ref<Option[]>([]);
const selectedRoomId = ref(undefined);

const getAdjustClassRoomList = (teachPlanId: string) => {
	showSelected.value = true;
	currentId.value = teachPlanId;
	getAdjustCourseClassRoomList(teachPlanId).then((res) => {
		classroomOption.value = res.map((item) => ({
			label: `${item.name}(${item.location})`,
			value: item.id,
		}));
	});
};

const hancleComfirm = () => {
	const params = [
		{
			teachPlanId: currentId.value,
			classroomId: selectedRoomId.value || '',
		},
	];
	updateTeachPlanClassroom(params).then(() => {
		showSelected.value = false;
		message.success('调换成功！');
		courseData.value = courseData.value.filter((item) => item.id !== currentId.value);
	});
};

const handleCancel = () => {
	showSelected.value = false;
	currentId.value = '';
	classroomOption.value = [];
	selectedRoomId.value = undefined;
};

const getDetailsData = () => {
	const { classroomId, teachDate } = props;
	getClassroomScheduleDetails({ classroomId, teachDate }).then((res) => {
		const { classroomTeachPlanList, ...rest } = res;
		classroomData.value = { ...rest };
		courseData.value = classroomTeachPlanList.map((item) => {
			const {
				coursePlanData: { startTime, endTime, teacherName, phone },
				courseData: { courseName, courseNature, courseType, coverUrl },
				teachPlanId,
			} = item;
			return {
				id: teachPlanId,
				time: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`,
				courseInfo: {
					courseName,
					courseTypeName: translationKey(courseType, dictionaryOption),
					courseNatureName: translationKey(courseNature, dictionaryOption),
					coverUrl,
				},
				teacherName,
				contact: phone,
			};
		});
	});
};

onMounted(() => {
	getDetailsData();
});
</script>

<template>
	<a-drawer :closable="false" v-model:open="open" destroy-on-close width="864" @close="open = false">
		<template #title>
			<div class="flex justify-between items-center">
				<div class="card-title">编辑</div>
				<a-button type="link" @click="open = false">
					<template #icon>
						<close-svg />
					</template>
				</a-button>
			</div>
		</template>
		<div class="drawer-title">基础信息</div>
		<a-descriptions :column="2" v-if="classroomData" :label-style="{ width: '130px !important' }">
			<a-descriptions-item label="实训基地名称">{{ classroomData.name }}</a-descriptions-item>
			<a-descriptions-item label="实训基地归属">{{
				translationValue(classroomData.source, sourceOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地性质">{{
				translationValue(classroomData.nature, natureOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地类型">{{
				translationValue(classroomData.type, typeOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地类别">{{
				translationKey(classroomData.typeDictionaryId, dictionaryOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="实训基地容量">{{ classroomData.capacity }}人</a-descriptions-item>
			<a-descriptions-item label="实训基地状态">{{ classroomData.disable ? '停用' : '启用' }}</a-descriptions-item>
			<a-descriptions-item label="实训基地建设状态">{{
				translationValue(classroomData.constructStatus, constructStatusOption)
			}}</a-descriptions-item>
			<a-descriptions-item label="负责人" :span="2">{{ classroomData.mangerName }}</a-descriptions-item>
			<a-descriptions-item label="实训基地位置" :span="2">{{ classroomData.location }}</a-descriptions-item>
			<a-descriptions-item label="实训基地描述" :span="2">{{ classroomData.description }}</a-descriptions-item>
			<a-descriptions-item label="实训基地封面">
				<img
					v-if="classroomData.coverUrl"
					:src="classroomData?.coverUrl"
					style="width: 109.5px; height: 147px; border-radius: 8px"
					alt=""
				/>
				<img
					v-else
					src="/images/report/default3.png"
					style="width: 109.5px; height: 147px; border-radius: 8px"
					alt=""
				/>
			</a-descriptions-item>
		</a-descriptions>
		<a-divider />
		<div class="drawer-title">课程安排</div>
		<a-table
			:columns="classroomData?.disable ? courseArrangementColumns : courseArrangementColumns.slice(0, -1)"
			:data-source="courseData"
			:pagination="false"
			:row-key="(record) => record.id"
			:size="'small'"
		>
			<template #emptyText>
				<m-empty size="small"></m-empty>
			</template>
			<template
				#bodyCell="{
					column,
					record: {
						courseInfo: { courseName, courseTypeName, courseNatureName, coverUrl },
						id,
					},
				}: TableRow<CourseArrangement>"
			>
				<template v-if="column.dataIndex === 'courseInfo'">
					<div class="flex">
						<div class="mr-4">
							<img :src="coverUrl" style="width: 60px; height: 60px; border-radius: 8px" alt="" />
						</div>
						<div>
							<div>课程名称：{{ courseName }}</div>
							<div>课程类型：{{ courseTypeName }}</div>
							<div>课程性质：{{ courseNatureName }}</div>
						</div>
					</div>
				</template>
				<template v-if="column.dataIndex === 'operation' && classroomData?.disable">
					<div v-if="showSelected && currentId === id" class="flex justify-between">
						<a-select
							class="w-32"
							v-model:value="selectedRoomId"
							:options="classroomOption"
							placeholder="请选择"
						></a-select>
						<div>
							<a-button class="px-1" type="link" @click="hancleComfirm">确定</a-button>
							<a-button class="px-1" type="link" @click="handleCancel">取消</a-button>
						</div>
					</div>
					<a-button v-else type="link" @click="getAdjustClassRoomList(id)">调换实训室</a-button>
				</template>
			</template>
		</a-table>
		<!-- <a-divider />
		<div class="flex justify-between items-center">
			<div class="drawer-title">其他安排</div>
			<a-button type="link" @click="handleAdd">添加</a-button>
		</div>
		<a-table
			:columns="otherArrangementColumns"
			:data-source="otherData"
			:pagination="false"
			:row-key="(record) => record.id"
			:size="'small'"
		>
			<template #bodyCell="{ column, text, record }: TableRow<OtherArrangement>">
				<template v-if="column.dataIndex === 'item'">
					<a-textarea
						v-if="editableData[record.key]"
						:auto-size="true"
						v-model:value="editableData[record.key].item"
						placeholder="请输入"
					></a-textarea>
					<template v-else>
						{{ text }}
					</template>
				</template>
				<template v-else-if="column.dataIndex === 'class'">
					<a-select
						class="w-28"
						v-if="editableData[record.key]"
						v-model:value="editableData[record.key].class"
						:options="[
							{ value: 1, label: '上午第一节' },
							{ value: 2, label: '上午第二节' },
						]"
						placeholder="请选择"
					></a-select>
					<template v-else>
						{{ text }}
					</template>
				</template>
				<template v-else-if="column.dataIndex === 'startTime'">
					<a-time-picker
						v-if="editableData[record.key]"
						v-model:value="editableData[record.key].startTime"
						value-format="HH:mm:ss"
					/>
					<template v-else>
						{{ text }}
					</template>
				</template>
				<template v-else-if="column.dataIndex === 'endTime'">
					<a-time-picker
						v-if="editableData[record.key]"
						v-model:value="editableData[record.key].endTime"
						value-format="HH:mm:ss"
					/>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <div class="drawer-title">课程安排</div>  
    <a-table
      :columns="courseArrangementColumns"
      :data-source="courseData"
      :pagination="false"
      :row-key="(record) => record.id"
      :size="'small'"
    >
      <template #emptyText>
        <m-empty size="small"></m-empty>
      </template>
      <template #bodyCell="{column, record: {courseInfo: {courseName, courseTypeName, courseNatureName, coverUrl}}} :TableRow<CourseArrangement>">
        <template v-if="column.dataIndex === 'courseInfo'">
          <div class="flex">
            <div class="mr-4">
              <img :src="coverUrl" style="width: 60px; height: 60px; border-radius: 8px" alt="" />
            </div>
            <div>
              <div>课程名称：{{ courseName }}</div>
              <div>课程类型：{{ courseTypeName }}</div>
              <div>课程性质：{{ courseNatureName }}</div>
            </div>
          </div>
        </template>
      </template>
    </a-table> -->
		<!-- <a-divider />
    <div class="flex justify-between items-center">
      <div class="drawer-title">其他安排</div>
      <a-button type="link" @click="handleAdd">添加</a-button>
    </div>
    <a-table
      :columns="otherArrangementColumns"
      :data-source="otherData"
      :pagination="false"
      :row-key="(record) => record.id"
      :size="'small'"
    >
      <template #bodyCell="{column, text, record} :TableRow<OtherArrangement>">
        <template v-if="column.dataIndex === 'item'">
          <a-textarea
            v-if="editableData[record.key]"
            :auto-size="true"
            v-model:value="editableData[record.key].item"
            placeholder="请输入"
          ></a-textarea>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'class'">
          <a-select
            class="w-28"
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key].class"
            :options="[{value: 1, label:'上午第一节'}, {value: 2, label:'上午第二节'}]"
            placeholder="请选择"
          ></a-select>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'startTime'">
          <a-time-picker 
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key].startTime" 
            value-format="HH:mm:ss" 
          />
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'endTime'">
          <a-time-picker 
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key].endTime" 
            value-format="HH:mm:ss" 
          />
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <a-textarea
            v-if="editableData[record.key]"
            :auto-size="true"
            v-model:value="editableData[record.key].description"
            placeholder="请输入"
          ></a-textarea>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="flex">
            <div v-if="editableData[record.key]">
              <a-button class="px-1" type="link" @click="save(record.key)">保存</a-button>
              <a-popconfirm title="确定取消?" @confirm="cancel(record.key)">
               <a-button class="px-1" type="link">取消</a-button>
              </a-popconfirm>
            </div>
            <a-button v-else class="px-1" type="link" @click="edit(record.key)">编辑</a-button>
            <a-button class="px-1" type="link" danger @click="handleDelete(record.key)">删除</a-button> 
          </div>
        </template>
      </template>
    </a-table> -->
	</a-drawer>
</template>
