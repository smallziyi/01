import { Badge as ABadge } from 'ant-design-vue';

const courseMenu = defineComponent({
	setup() {
		// 从 localStorage 中获取已展开节点的 ID
		const storedExpandedNodes = JSON.parse(localStorage.getItem('course_menu_expanded_nodes') || '[]');
		const expandedNodes = ref<Set<string>>(new Set(storedExpandedNodes));

		const toggleNode = (id: string) => {
			if (expandedNodes.value.has(id)) {
				expandedNodes.value.delete(id);
			} else {
				expandedNodes.value.add(id);
			}
			// 更新 localStorage
			localStorage.setItem('course_menu_expanded_nodes', JSON.stringify(Array.from(expandedNodes.value)));
		};

		return { expandedNodes, toggleNode };
	},
	props: {
		tree: {
			type: Array<Tree>,
			required: true,
			default: [],
		},
		currentCourse: {
			type: Array<string>,
			required: true,
			default: [],
		},
	},
	methods: {
		renderMenuTree(menuTrees: Array<Tree>) {
			return menuTrees.map((menuItem) => (
				<div key={menuItem.id} class={'w-full'}>
					<div
						class={`cursor-pointer flex leading-6 text-sm hover:bg-bg-[#0091FF1A] rounded p-0.5}`}
						onClick={() => (menuItem.display = !menuItem.display)}
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
							class={`text-nowrap text-ellipsis overflow-hidden flex justify-between grow ${this.$props.currentCourse.includes(menuItem.id) ? 'text-blue-500' : ''}`}
						>
							<div>{menuItem.label}</div>
							<div>{this.$props.currentCourse.includes(menuItem.id) ? <ABadge status={'processing'} /> : null}</div>
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
		return <div>{this.renderMenuTree(this.$props.tree)}</div>;
	},
});

export default courseMenu;
