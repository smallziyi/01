import lunisolar from 'lunisolar';

const holidays = ref<{ day: [number, number]; name: string }[]>([]);

function useHoliday() {
	function generate(year: number) {
		holidays.value.push({ day: [1, 1], name: '元旦节' });
		holidays.value.push({ day: [5, 1], name: '劳动节' });
		holidays.value.push({ day: [10, 1], name: '国庆节' });

		const a = lunisolar.fromLunar({ month: 8, day: 15, year: year }).toDate();
		holidays.value.push({ day: [a.getMonth(), a.getDate()], name: '中秋节' });

		const b = lunisolar.fromLunar({ month: 5, day: 5, year: year }).toDate();
		holidays.value.push({ day: [b.getMonth(), b.getDate()], name: '端午节' });

		const c = lunisolar.fromLunar({ month: 1, day: 1, year: year }).toDate();
		holidays.value.push({ day: [c.getMonth(), c.getDate()], name: '春节' });
	}

	return { holidays, generate };
}

export default useHoliday;
