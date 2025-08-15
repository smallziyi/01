import { defineComponent } from 'vue';
export default defineComponent({
	name: 'CourseMenu',
	props: {
		menuTrees: {
			type: Array as () => Array<Tree>,
			required: true,
		},
		selected: {
			type: Array as () => Array<Tree>,
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
		// 获取本地存储中的展开节点ID列表
		getExpandedMenuIds() {
			return JSON.parse(localStorage.getItem('expandedMenuIds') || '[]');
		},

		// 保存当前展开的节点ID到localStorage
		saveExpandedMenuIds(menuIds: string[]) {
			localStorage.setItem('expandedMenuIds', JSON.stringify(menuIds));
		},
		toggleDisplay(menuItem: Tree) {
			menuItem.display = !menuItem.display;
			// 获取当前展开的节点ID
			let expandedMenuIds = this.getExpandedMenuIds();

			if (menuItem.display) {
				// 如果当前节点展开，将ID加入到localStorage
				expandedMenuIds.push(menuItem.id);
			} else {
				// 如果收起，从localStorage中移除该ID
				expandedMenuIds = expandedMenuIds.filter((id: any) => id !== menuItem.id);
			}

			// 保存到localStorage
			this.saveExpandedMenuIds(expandedMenuIds);
			if (menuItem.level === 1) {
				this.$emit('select', [menuItem]);
			} else if (menuItem.level === 2) {
				const parent = this.$props.menuTrees.find((item) => item.id === menuItem.parentId);
				this.$emit('select', [parent, menuItem]);
			} else if (menuItem.level === 3) {
				let taskMenu = this.$props.selected[1];
				this.$props.menuTrees.forEach((item) => {
					item.children?.forEach((v) => {
						if (v.id === menuItem.parentId) {
							taskMenu = v;
						}
					});
				});
				this.$emit('select', [this.$props.selected[0], taskMenu, menuItem]);
			}
		},
		renderMenuTree(menuTrees: Array<Tree>) {
			return menuTrees.map((menuItem) => {
				// 根据localStorage判断是否展开
				const expandedMenuIds = this.getExpandedMenuIds();
				menuItem.display = expandedMenuIds.includes(menuItem.id);
				return (
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
								class={'text-nowrap text-ellipsis overflow-hidden'}
								style={{
									width: `calc(314px - 16px - ${menuItem.level * 16 - 16}px)`,
								}}
							>
								{menuItem.label}
							</div>
						</div>
						{menuItem.display && menuItem.children && menuItem.children.length > 0 ? (
							<div>{this.renderMenuTree(menuItem.children)}</div>
						) : null}
					</div>
				);
			});
		},
	},
	// 初始化时从localStorage加载展开的节点
	created() {
		const expandedMenuIds = this.getExpandedMenuIds();
		this.menuTrees.forEach((menuItem) => {
			if (expandedMenuIds.includes(menuItem.id)) {
				menuItem.display = true;
			}
		});
	},
	render() {
		return <div>{this.renderMenuTree(this.menuTrees)}</div>;
	},
});
