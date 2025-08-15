// 此方法用于table设置scroll高度（可视窗口）
export default function useCalcHeight(fixedHeight: number = 0) {
	// js获取可视窗口高度
	const calcHeight = ref<number>(window.innerHeight - fixedHeight);

	const updateHeight = () => {
		calcHeight.value = window.innerHeight - fixedHeight;
	};

	onMounted(() => {
		window.addEventListener('resize', updateHeight);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', updateHeight);
	});
	return { calcHeight };
}
