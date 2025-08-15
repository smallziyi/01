import { defineComponent, PropType } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import MenuIcon from './menu-icon.vue';

const RecursiveMenu = defineComponent({
	name: 'RecursiveMenu',
	props: {
		routes: {
			type: Array as PropType<RouteRecordRaw[]>,
			required: true,
		},
	},
	setup(props) {
		const renderMenuItem = (route: RouteRecordRaw) => {
			if (route.children?.length) {
				return (
					<a-sub-menu
						key={route.path}
						title={route.meta?.title}
						icon={route.meta?.icon ? <MenuIcon icon={route.meta.icon} /> : null}
					>
						<RecursiveMenu routes={route.children} />
					</a-sub-menu>
				);
			}

			return (
				<a-menu-item key={route.path} icon={route.meta?.icon ? <MenuIcon icon={route.meta.icon} /> : null}>
					{route.meta?.title}
				</a-menu-item>
			);
		};

		return () => <>{props.routes.map((route) => renderMenuItem(route))}</>;
	},
});

export default RecursiveMenu;
