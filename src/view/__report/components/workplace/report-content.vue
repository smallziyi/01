<script setup lang="ts">
import SurveyContentBackground from './survey/survey-content-background.vue';
import SurveyContentMeaning from './survey/survey-content-meaning.vue';
import SurveyContentOtherSuggest from './survey/survey-content-other-suggest.vue';
import SurveyContentConclusion from './survey/survey-content-conclusion.vue';
import ContentOther from './cultivate/content-other.vue';
import SummaryTable from './cultivate/summary-table.vue';
import PreparationNote from './course-standard/preparation-note.vue';
import CourseOverviewTable from './course-standard/course-overview-table.vue';
import CourseStandardDesignIdeas from './course-standard/course-standard-design-ideas.vue';
import DisplayCareerDemand from './course-develop/display-career-demand.vue';
import ReportContentTable from './report-content-table.vue';
import TextWriting from './course-standard/text-writing.vue';
import TextWritingInstruction from './cultivate/text-writing-instruction.vue';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';

const menu = defineModel<Tree>('menu', { required: true });
defineProps<{ type: 'preview' | 'edit' | 'audit' }>();
const error = defineModel<Array<string>>('error', { required: true, default: [] });
const checkError = defineModel<boolean>('checkError', { required: true, default: false });

const { reportInfo } = useReportInfo();
</script>

<template>
	<div>
		<template v-if="reportInfo.reportType === 1">
			<template v-if="['background_1', 'background_2', 'background_3'].includes(menu.type!)">
				<survey-content-background :menu="menu" :key="menu.type" :report-status="reportInfo.reportStatus" />
			</template>
			<template v-else-if="['meaning_1', 'meaning_2', 'meaning_3'].includes(menu.type!)">
				<survey-content-meaning :menu="menu" :key="menu.type" :report-status="reportInfo.reportStatus" />
			</template>
			<survey-content-other-suggest
				v-else-if="menu.type === 'other_suggest'"
				:menu="menu"
				:report-status="reportInfo.reportStatus"
			/>
			<survey-content-conclusion
				v-else-if="menu.type === 'last_place_elimination_new_job'"
				:menu="menu"
				:report-id="reportInfo.reportId"
				:report-status="reportInfo.reportStatus"
			/>
			<report-content-table
				v-else
				:key="menu.id"
				v-if="menu.type"
				:menu-id="menu.id"
				:page-type="type"
				:report-id="reportInfo.reportId"
				:report-status="reportInfo.reportStatus"
				:type="menu.type"
				:error="error"
				:check-error="checkError"
				:report-type="reportInfo.reportType"
			/>
		</template>
		<template v-else-if="reportInfo.reportType === 2">
			<content-other
				v-if="
					['major_name', 'major_code', 'enrollment_target', 'grade_qualification_learning_modality'].includes(
						menu?.type!,
					)
				"
				:menu="menu"
				:report-status="reportInfo.reportStatus"
			/>
			<template v-else-if="['graduation_requirement', 'execution_specification'].includes(menu.type!)">
				<text-writing-instruction
					:report-id="reportInfo.reportId"
					:menu="menu"
					:key="menu.type"
					:report-status="reportInfo.reportStatus"
				/>
			</template>
			<summary-table
				v-else-if="menu.type === 'cultivate_professional_curriculum_system'"
				:menu="menu"
				:report-id="reportInfo.reportId"
				:report-status="reportInfo.reportStatus"
			/>
			<report-content-table
				v-else
				:key="menu.id"
				v-if="menu.type"
				:menu-id="menu.id"
				:page-type="type"
				:report-id="reportInfo.reportId"
				:report-status="reportInfo.reportStatus"
				:type="menu.type"
				:error="error"
				:check-error="checkError"
				:report-type="reportInfo.reportType"
			/>
		</template>
		<template v-else-if="reportInfo.reportType === 3">
			<display-career-demand :occupation-quality-info="menu.occupationQuality!"></display-career-demand>
		</template>
		<template v-else-if="reportInfo.reportType === 4">
			<preparation-note
				v-if="menu.type === 'course_standard_preparation_instructions'"
				:report-id="reportInfo.reportId"
				:menu="menu"
				:report-status="reportInfo.reportStatus"
			/>
			<course-overview-table
				v-else-if="menu.type === 'course_standard_course_overview'"
				:report-id="reportInfo.reportId"
				:menu="menu"
				:report-status="reportInfo.reportStatus"
			/>
			<template
				v-else-if="
					[
						'course_standard_course_nature',
						'course_standard_knowledge_objectives',
						'course_standard_skill_objectives',
						'course_standard_quality_objectives',
						'course_standard_other_teaching_conditions',
						'course_standard_reference_textbooks_materials',
					].includes(menu.type!)
				"
			>
				<text-writing
					:report-id="reportInfo.reportId"
					:menu="menu"
					:key="menu.type"
					:report-status="reportInfo.reportStatus"
				/>
			</template>

			<course-standard-design-ideas
				v-else-if="menu.type === 'course_standard_design_ideas'"
				:report-id="reportInfo.reportId"
				:menu="menu"
				:report-status="reportInfo.reportStatus"
			/>
			<report-content-table
				v-else
				:key="menu.id"
				v-if="menu.type"
				:menu-id="menu.id"
				:page-type="type"
				:report-id="reportInfo.reportId"
				:report-status="reportInfo.reportStatus"
				:type="menu.type"
				:error="error"
				:check-error="checkError"
				:report-type="reportInfo.reportType"
			/>
		</template>
	</div>
</template>
