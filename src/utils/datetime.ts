import dayjs from 'dayjs';

const datetime = {
	format: (val: string, type: 'full' | 'date' | 'time' = 'full') => {
		switch (type) {
			case 'full':
				return dayjs(new Date(val)).format('YYYY/MM/DD HH:mm:ss');
			case 'date':
				return dayjs(new Date(val)).format('YYYY/MM/DD');
			case 'time':
				return dayjs(new Date(val)).format('HH:mm:ss');
		}
	},
	dateStartTime: (val: string) => {
		return dayjs(new Date(val)).format('YYYY/MM/DD 00:00:00');
	},
	dateEndTime: (val: string) => {
		return dayjs(new Date(val)).format('YYYY/MM/DD 23:59:59');
	},
	year: (val: string) => {
		return dayjs(new Date(val)).format('YYYY');
	},
	monthDay: (val: string) => {
		return dayjs(new Date(val)).format('MM/DD');
	},
};

export default datetime;
