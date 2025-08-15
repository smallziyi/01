import { ReportType } from '@/view/__report';

interface ReportInfo {
	reportId: string;
	reportStatus: number;
	reportType: ReportType;
	reportAuditType: number;
	reportSubmitter: string;
	reportScore: number;
	userAuditFlag: boolean;
	relationReportId?: string;
	pageType: 'edit' | 'audit' | 'preview';
}

const reportInfo = ref<ReportInfo>({
	reportId: '',
	reportStatus: 0,
	reportType: 1,
	reportAuditType: 0,
	reportSubmitter: '',
	reportScore: 0,
	relationReportId: '',
	userAuditFlag: false,
	pageType: 'edit',
});

function useReportInfo() {
	const setReportInfo = (value: ReportInfo) => {
		reportInfo.value = value;
	};

	return { reportInfo, setReportInfo };
}

export default useReportInfo;
