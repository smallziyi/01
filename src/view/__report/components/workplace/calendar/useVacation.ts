import { ResourceCalendar } from '@/view/__report/components/workplace/calendar/index.ts';

const vacations = ref<ResourceCalendar[]>([]);

function useVacation() {
	return { vacations };
}

export default useVacation;
