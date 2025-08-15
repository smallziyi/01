import { AnalysisInfo } from '@/view/analysis';
// 计算平均值   基础维度 (五分制)
const calculateAverage = (numbers: number[]): number => {
	const sum = +numbers.reduce((acc, num) => +acc + +num, 0);
	const length = numbers.length;
	return +(sum / length).toFixed(2);
};

// 将所有数据转 （百分制）
const transferPercent = (numbers: number[]): number[] => {
	return numbers.map((number) => +(number * 20).toFixed(2));
};

// 基础维度平均值
const calculateBasic = (numbers: number[]) => {
	const basicList = ref<number[]>([]);
	const copyList = numbers.slice();
	basicList.value = copyList.reverse().map((item) => +item.toFixed(2));
	return basicList.value;
};

// 认知与知识目标 || 技能与能力目标 || 素质与素养目标
const calculatePercent = (numbers: number[]) => {
	const cognitionList = ref<number[]>([]);
	const cognitionAverage = calculateAverage(numbers);
	cognitionList.value = transferPercent([...numbers, cognitionAverage]);
	return cognitionList.value;
};

// 给出x轴和y轴数据  1 认知与知识  2技能与能力
const calculateXY = (AnalysisInfo: AnalysisInfo[], type?: number) => {
	const xData = AnalysisInfo.map((item) => item.name);
	const yTemp = AnalysisInfo.map((item) =>
		calculatePercent(type === 1 ? item.scores.slice(0, 3) : type === 2 ? item.scores.slice(3) : item.scores),
	);
	const yData = combineArrays(yTemp);
	return {
		xData,
		yData,
	};
};

const combineArrays = (arrays: number[][]): number[][] => {
	if (arrays.length === 0) {
		return [];
	}
	return arrays[0].map((_, index) => {
		return arrays.map((array) => array[index]);
	});
};

// 计算六边形面积
const calculateArea = (sides: number[]): number => {
	// 确保 sides 数组长度为 6
	if (sides.length !== 6) {
		throw new Error('必须提供六个边长');
	}
	// 计算相邻边长乘积的和
	const area = sides.reduce((acc, side, i) => {
		return acc + side * sides[(i + 1) % sides.length];
	}, 0);
	// 将面积与边长为5的正六边形面积进行比较，并转换为百分数
	return +((area / 150) * 100).toFixed(2);
};

export { calculateAverage, calculateBasic, calculateArea, combineArrays, calculateXY };
