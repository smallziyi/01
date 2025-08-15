import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';
import { Badge as ABadge } from 'ant-design-vue';

export default defineComponent({
	name: 'ReportMenu',
	setup() {
		const status = ['', 'success', 'processing', 'warning'];
		const { reportInfo } = useReportInfo();
		return { status, reportInfo };
	},
	props: {
		menuTrees: {
			type: Array as () => Array<Tree>,
			required: true,
		},
		selected: {
			type: Array as () => Array<Tree>,
			required: true,
		},
		showError: {
			type: Boolean,
			required: true,
		},
		error: {
			type: Array<String>,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	emits: ['select'],
	computed: {
		getFirstActiveMenuId() {
			return (
				(this.$props.selected &&
					this.$props.selected.length &&
					this.$props.selected[this.$props.selected.length - 1].id) ||
				''
			);
		},
	},
	methods: {
		toggleDisplay(menuItem: Tree) {
			menuItem.display = !menuItem.display;

			if (menuItem.level === 1) {
				this.$emit('select', [menuItem]);
			} else if (menuItem.level === 2) {
				const parent = this.$props.menuTrees.find((item) => item.id === menuItem.parentId);
				this.$emit('select', [parent, menuItem]);
			} else if (menuItem.level === 3) {
				let flag = true;
				let taskMenu = this.$props.selected[1];
				this.$props.menuTrees.forEach((item) => {
					item.children?.forEach((v) => {
						if (v.id === menuItem.parentId) {
							if (v.editedFlag) {
								flag = false;
							}
							taskMenu = v;
						}
					});
				});
				if (!flag || [6, 7].includes(this.reportInfo.reportType)) {
					this.$emit('select', [this.$props.selected[0], taskMenu, menuItem]);
				} else {
					this.$emit('select', [this.$props.selected[0], taskMenu]);
					message.warning('请先完成任务单内容');
				}
			}
		},
		hasError(item: Tree): boolean {
			if (this.error.includes(item.id)) {
				return true;
			}
			if (item.children && item.children.length) {
				return item.children.some((child) => this.hasError(child));
			}
			return false;
		},
		renderMenuTree(menuTrees: Array<Tree>) {
			return menuTrees.map((menuItem) => (
				<div key={menuItem.id}>
					<div
						class={`cursor-pointer flex leading-6 text-sm hover:bg-bg-[#0091FF1A] rounded p-0.5 ${this.getFirstActiveMenuId === menuItem.id ? 'bg-[#0091FF1A] text-[#0091FF]' : ''} ${this.showError && this.hasError(menuItem) ? 'decoration-wavy underline decoration-red-500' : ''}`}
						onClick={() => this.toggleDisplay(menuItem)}
					>
						<div style={{ width: `${menuItem.level * 16 - 16}px`, minWidth: `${menuItem.level * 16 - 16}px` }}></div>
						<div class={'w-4 min-w-4'}>
							{menuItem.children && menuItem.children.length ? (
								menuItem.display ? (
									<i class="bi bi-caret-down-fill"></i>
								) : (
									<i class="bi bi-caret-right-fill"></i>
								)
							) : (
								<div></div>
							)}
						</div>
						<div
							class={'text-nowrap text-ellipsis overflow-hidden'}
							style={{
								width: `calc(314px - 16px - ${menuItem.level * 16 - 16}px)`,
							}}
						>
							{menuItem.label} {this.type === 'edit' && menuItem.tableEditStatus === 1 && <ABadge status={'success'} />}
							{this.type === 'edit' && menuItem.tableEditStatus === 2 && <ABadge status={'processing'} />}
							{this.type === 'edit' && menuItem.tableEditStatus === 3 && <ABadge status={'warning'} />}
							{this.type === 'audit' && menuItem.tableAuditStatus === 1 && <ABadge status={'success'} />}
							{this.type === 'audit' && menuItem.tableAuditStatus === 2 && <ABadge status={'processing'} />}
							{this.type === 'audit' && menuItem.tableAuditStatus === 3 && <ABadge status={'warning'} />}
							{[7].includes(this.reportInfo.reportType) && (
								<ABadge status={this.status[menuItem.tableAllAuditStatus]} />
							)}
						</div>
					</div>
					{menuItem.display && menuItem.children && menuItem.children.length > 0 ? (
						<div>{this.renderMenuTree(menuItem.children)}</div>
					) : null}
				</div>
			));
		},
	},
	render() {
		return <div>{this.renderMenuTree(this.menuTrees)}</div>;
	},
});
