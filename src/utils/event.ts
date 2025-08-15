import mitt from 'mitt';

type Events = {
	'survey-table-save': any;
	'survey-table-comment': any;
	'survey-table-download': any;
	'survey-table-upload': any;
	'survey-table-reset': any;
	report_table_save: any;
	report_table_add_comment: any;
	report_table_recover_comment: any;
	report_table_comment_cells: any;
	report_table_download_template: any;
	report_table_upload_excel: any;
	report_table_reset_table_data: any;
	report_table_check: any;
	'*': any;
};

const emitter = mitt<Events>();

export default emitter;
