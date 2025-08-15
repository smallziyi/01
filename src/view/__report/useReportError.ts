const info = ref<{ display: boolean; errors: Array<string> }>({ display: false, errors: [] });

function useReportError() {
	function toggleDisplayError(value?: boolean) {
		info.value.display = value ?? !info.value.display;
	}

	function setErrors(errors: Array<string>) {
		info.value.errors = errors;
	}

	function removeError(error: string) {
		info.value.errors = info.value.errors.filter((item) => item !== error);
	}

	return { info, toggleDisplayError, setErrors, removeError };
}

export default useReportError;
