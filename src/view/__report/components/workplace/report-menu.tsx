import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ReportMenu',
	props: {
		menuTrees: {
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
	},
	emits: ['select'],
	data() {
		return {
			activeMenu: '',
		};
	},
	methods: {
		toggleDisplay(menuItem: Tree) {
			if (menuItem.children && menuItem.children.length) {
				menuItem.display = !menuItem.display;
			} else {
				this.$emit('select', menuItem);
				this.$data.activeMenu = menuItem.id;
			}
		},
		hasError(item: Tree): boolean {
			if (this.error.includes(item.id)) {
				return true;
			} else {
				if (item.children && item.children.length) {
					return item.children.some((child) => this.hasError(child));
				} else {
					return false;
				}
			}
		},
		renderMenuTree(menuTrees: Array<Tree>) {
			return menuTrees.map((menuItem) => (
				<div key={menuItem.id}>
					<div
						class={`cursor-pointer flex leading-6 text-sm hover:bg-[#0091FF1A] rounded p-0.5 ${this.activeMenu === menuItem.id ? 'bg-[#0091FF1A]  text-[#0091FF]' : ''} ${this.showError && this.hasError(menuItem) ? 'decoration-wavy underline decoration-red-500' : ''}`}
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
								color: menuItem.tableDataFlag ? '#18bf7a' : '',
							}}
						>
							{menuItem.label}
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
