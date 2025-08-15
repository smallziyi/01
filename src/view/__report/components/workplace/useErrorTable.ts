const errorTables = ref<Array<string>>([]);

function useErrorTable() {
	function setErrors(errors: Array<string>) {
		errorTables.value.push(...errors);
	}

	return { errorTables, setErrors };
}

export default useErrorTable;
