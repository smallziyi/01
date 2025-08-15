<script setup lang="ts">
import { ReportField, REPORT_TYPE } from '@/view/__report';
import { translationKey } from '@/utils/dictionary';
import CulivateInstructionBook from '@/view/__report/components/workplace/instruction-book.vue';
import { useDictionaryStore } from '@/store/modules/dictionaryStore';

const { dictionaryOption } = useDictionaryStore();

defineProps<{
	menu: Tree;
	reportStatus: number;
}>();

const report: ReportField = inject('report') as ReportField;
</script>
<template>
	<culivate-instruction-book :report-type="REPORT_TYPE.CULTIVATE" :type="menu.type" />
	<div v-if="menu.type === 'major_name'">
		{{ report.majorData.label }}
	</div>
	<div v-else-if="menu.type === 'major_code'">
		{{ report.majorData.value }}
	</div>
	<div v-else-if="menu.type === 'enrollment_target'">
		{{ translationKey(report.otherField.enrollmentTarget, dictionaryOption) }}
	</div>
	<div v-else-if="menu.type === 'grade_qualification_learning_modality'">
		<div>
			<span class="mr-5">学制学历:</span>
			{{ translationKey(report.otherField.qualification, dictionaryOption) }}
			({{ translationKey(report.otherField.grade, dictionaryOption) }})
		</div>
		<div>
			<span class="mr-5">学习形式:</span>
			{{ translationKey(report.otherField.learningModality, dictionaryOption) }}学习
		</div>
	</div>
</template>
