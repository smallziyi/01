import { computed } from 'vue';
import useReportError from '@/view/__report/useReportError.ts';
import { Badge as ABadge } from 'ant-design-vue';
import useRouterParams from '@/hooks/useRouterParams.ts';

export default defineComponent({
	setup() {
		const { info } = useReportError();

		const hasError = computed(() => (menuItem: Tree): boolean => {
			if (info.value.display && info.value.errors.includes(menuItem.id)) {
				return true;
			}
			return menuItem.children?.some((child) => hasError.value(child)) || false;
		});

		const status = ['', 'success', 'processing', 'warning'];

		const params = useRouterParams<{ reportId: string; type: 'edit' | 'audit' | 'preview' }>();

		return { info, hasError, status, params };
	},
	props: {
		menuTree: {
			type: Array<Tree>,
			required: true,
			default: [],
		},
		selected: {
			type: Array as () => Array<Tree>,
			required: true,
			default: [],
		},
	},
	computed: {
		getFirstActiveMenuId() {
			return (this.selected && this.selected.length && this.selected[this.selected.length - 1].id) || '';
		},
	},
	emits: ['select'],
	methods: {
		toggleDisplay(menuItem: Tree) {
			menuItem.display = !menuItem.display;

			if (menuItem.level === 1) {
				this.$emit('select', [menuItem]);
			} else if (menuItem.level === 2) {
				const parent = this.menuTree.find((item) => item.id === menuItem.parentId);
				if (parent) {
					this.$emit('select', [parent, menuItem]);
				} else {
					this.$emit('select', [menuItem]);
				}
			} else if (menuItem.level === 3) {
				const result = this.menuTree.reduce((acc, item) => {
					const child = item.children?.find((child) => child.id === menuItem.parentId);
					if (child) {
						acc.push(item, child, menuItem);
					}
					return acc;
				}, [] as Tree[]);

				this.$emit('select', result);
			}
		},
		renderMenuTree(menuTrees: Array<Tree>) {
			return menuTrees.map((menuItem) => (
				<div key={menuItem.id}>
					<div class={this.getMenuItemClass(menuItem)} onClick={() => this.toggleDisplay(menuItem)}>
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
							class="text-nowrap text-ellipsis overflow-hidden flex justify-between"
							style={{
								width: `calc(314px - 16px - ${menuItem.level * 16 - 16}px)`,
							}}
						>
							<div
								class={this.hasError(menuItem) ? 'underline underline-offset-4 decoration-red-500 decoration-wavy' : ''}
							>
								{menuItem.label}
							</div>
							<ABadge
								status={this.status[this.params.type === 'edit' ? menuItem.tableEditStatus : menuItem.tableAuditStatus]}
							/>
						</div>
					</div>
					{menuItem.display && menuItem.children && menuItem.children.length > 0 ? (
						<div>{this.renderMenuTree(menuItem.children)}</div>
					) : null}
				</div>
			));
		},
		getMenuItemClass(menuItem: Tree) {
			const baseClass = 'cursor-pointer flex leading-6 text-sm hover:bg-bg-[#0091FF1A] rounded p-0.5';
			const activeClass = this.getFirstActiveMenuId === menuItem.id ? 'bg-[#0091FF1A] text-[#0091FF]' : '';
			return `${baseClass} ${activeClass}`;
		},
	},
	render() {
		return <div>{this.renderMenuTree(this.menuTree)}</div>;
	},
});
