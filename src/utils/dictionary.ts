type Options = Record<string, Option[]>;
// 回显数据字典 (字符串数组)
/**
 * @param {string} value          - 数据字典的 value
 * @param {Object} options        - 数据字典的 value-label 映射
 * @returns {string} labelString - 数据字典的映射回来的字符串
 */
export const translationKey = (value?: number | string, options?: Options): string => {
	if (!value) return '';
	const itemMap: Record<string, string> = {};
	for (const key in options) {
		options[key].forEach((item: Option) => {
			itemMap[item.value] = item.label;
		});
	}
	return itemMap[value] || '';
};
// 回显Option下拉字段 (字符串数组)
/**
 * @param {string} value          - 数据字典的 value
 * @param {Object} options        - 数据字典的 value-label 映射
 * @returns {string} labelString - 数据字典的映射回来的字符串
 */
export const translationValue = (value?: number | string, options?: Option[]): string => {
	if (!value) return '';
	return options?.find((item) => item.value === value)?.label || '';
};

export enum DICTIONARY_TYPE {
	ENROLLMENT_TARGET = 7, // 招生对象
	GRADE, // 学制
	QUALIFICATION, // 学历
	LEARNING_MODALITY, // 学习形式
	COURSE_TYPE, // 课程类型
	COURSE_NATURE, // 课程性质
	CERTIFICATE_LEVEL, // 证书等级
	CLASSROOM_TYPE, // 实训基地类型
}
