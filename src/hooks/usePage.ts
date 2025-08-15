export default function usePage() {
	const state = reactive<{
		createOpen: boolean;
		updateOpen: boolean;
		readOpen: boolean;
		open: boolean;
		detailOpen: boolean;
		onlyOpen: boolean;
		currentId: string;
	}>({
		createOpen: false,
		updateOpen: false,
		readOpen: false,
		open: false,
		detailOpen: false,
		onlyOpen: false,
		currentId: '',
	});
	const onCreate = () => {
		state.currentId = '';
		state.createOpen = true;
	};
	const onUpdate = (id: string) => {
		state.currentId = id;
		state.updateOpen = true;
	};
	const onRead = (id: string) => {
		state.currentId = id;
		state.readOpen = true;
	};

	const onOpen = (id: string) => {
		state.currentId = id;
		state.open = true;
	};

	const onOnlyOpen = () => {
		state.onlyOpen = true;
	};
	const onDetailOpen = (id: string) => {
		state.detailOpen = true;
		state.currentId = id;
	};

	return {
		state,
		onCreate,
		onUpdate,
		onRead,
		onOpen,
		onOnlyOpen,
		onDetailOpen,
	};
}
