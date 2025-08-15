import { REPORT_PAGE_TYPE, REPORT_STATUS, ReportPageType } from '@/view/__report';

const useReportStatusOption = (type: ReportPageType) => {
	const result: Array<Option> = [];
	switch (type) {
		case REPORT_PAGE_TYPE.EDIT:
			Object.keys(REPORT_STATUS).forEach((key) => {
				if (REPORT_STATUS[+key].edit_search) {
					result.push({ value: +key, label: REPORT_STATUS[+key].label });
				}
			});
			break;
		case REPORT_PAGE_TYPE.AUDIT:
			Object.keys(REPORT_STATUS).forEach((key) => {
				if (REPORT_STATUS[+key].audit_search) {
					result.push({ value: +key, label: REPORT_STATUS[+key].label });
				}
			});
			break;
	}
	return result;
};

export { useReportStatusOption };
