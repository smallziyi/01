const data = ref({ id: '', level: 1, parentId: '' });

function useLearningTree() {
	const setData = (_data: { id: string; level: number; parentId: string }) => {
		data.value = _data;
	};

	return { data, setData };
}

export default useLearningTree;
