import { Badge as ABadge } from 'ant-design-vue';

export default defineComponent({
	setup() {
		const status = ['', 'success', 'processing', 'warning'];
		return { status };
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
			return (
				(this.$props.selected &&
					this.$props.selected.length &&
					this.$props.selected[this.$props.selected.length - 1].id) ||
				''
			);
		},
	},
	emits: ['select'],
	methods: {
		toggleDisplay(menuItem: Tree) {
			menuItem.display = !menuItem.display;

			if (menuItem.level === 1) {
				this.$emit('select', [menuItem]);
			} else if (menuItem.level === 2) {
				const parent = this.$props.menuTree.find((item) => item.id === menuItem.parentId);
				if (parent) {
					this.$emit('select', [parent, menuItem]);
				} else {
					// 处理未找到父项的情况，例如：
					this.$emit('select', [menuItem]);
				}
			} else if (menuItem.level === 3) {
				const result = this.$props.menuTree.reduce((acc, item) => {
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
					<div
						class={`cursor-pointer flex leading-6 text-sm hover:bg-bg-[#0091FF1A] rounded p-0.5 ${this.getFirstActiveMenuId === menuItem.id ? 'bg-[#0091FF1A] text-[#0091FF]' : ''}`}
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
							class={'text-nowrap text-ellipsis overflow-hidden flex justify-between'}
							style={{
								width: `calc(314px - 16px - ${menuItem.level * 16 - 16}px)`,
							}}
						>
							<div>{menuItem.label}</div>
							<ABadge status={this.status[menuItem.tableAllAuditStatus]} />
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
		return <div>{this.renderMenuTree(this.$props.menuTree)}</div>;
	},
});
