import { ReportMenuCourse } from '@/view/__report';

const taskForm = ref<ReportMenuCourse>();

function useTaskForm() {
	function setTaskForm(form: ReportMenuCourse) {
		taskForm.value = form;
	}

	return { taskForm, setTaskForm };
}

export default useTaskForm;
