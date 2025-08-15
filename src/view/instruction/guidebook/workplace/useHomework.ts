import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';

const homeworks = ref<Array<ReportCourseQuestion>>([]);

const saveHomework = ref(false);

function useHomework() {
	return { homeworks, saveHomework };
}

export default useHomework;
