// stores/dictionaryStore.ts
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { getDictionaryOptions } from '@/axios';
import { DICTIONARY_TYPE } from '@/utils/dictionary';

// 定义字典项的数据结构
export type DictionaryOption = Record<DICTIONARY_TYPE, Option[]>;

export const useDictionaryStore = defineStore(
	'dictionary',
	() => {
		const dictionaryOption = reactive<DictionaryOption>({
			7: [],
			8: [],
			9: [],
			10: [],
			11: [],
			12: [],
			13: [],
			14: [],
		}); // 全局字典存储

		// 获取字典数据，并存储在全局
		const fetchDictionary = async () => {
			const result = await getDictionaryOptions([
				DICTIONARY_TYPE.ENROLLMENT_TARGET, // 招生对象
				DICTIONARY_TYPE.GRADE, // 学制
				DICTIONARY_TYPE.QUALIFICATION, // 学历
				DICTIONARY_TYPE.LEARNING_MODALITY, // 学习形式
				DICTIONARY_TYPE.COURSE_TYPE, // 课程类型
				DICTIONARY_TYPE.COURSE_NATURE, // 课程性质
				DICTIONARY_TYPE.CERTIFICATE_LEVEL, // 证书等级
				DICTIONARY_TYPE.CLASSROOM_TYPE, // 实训基地类型
			]);
			Object.assign(dictionaryOption, result); // 更新全局的字典数据
			return dictionaryOption;
		};

		return {
			dictionaryOption,
			fetchDictionary,
		};
	},
	{
		persist: {
			// 使用 sessionStorage 进行持久化
			storage: sessionStorage,
			// 指定要持久化的字段
			paths: ['dictionaryOption'],
		},
	},
);
