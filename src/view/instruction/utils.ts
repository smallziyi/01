import { ReportCourseQuestion } from '@/view/__report/components/workplace/__course/type.ts';
import { message } from 'ant-design-vue';

async function checkQuestion(question: ReportCourseQuestion, index?: number): Promise<boolean> {
	if (!question.source.trim()) {
		message.warning(`${index !== undefined ? index + 1 : '该'}题未设置题目出处`);
		return false;
	}
	if (!question.title.trim()) {
		message.warning(`${index !== undefined ? index + 1 : '该'}题未设置题目`);
		return false;
	}
	if (question.options.length < 4) {
		message.warning(`${index !== undefined ? index + 1 : '该'}题选项不足四项`);
		return false;
	}

	const oi: string[] = [];
	question.options.forEach((item, _index) => {
		if (!item.content.trim()) {
			oi.push(String.fromCharCode(65 + _index));
		}
	});

	if (oi.length) {
		message.warning(`${index !== undefined ? index + 1 : '该'}题选项${oi.join('、')}无内容`);
		return false;
	}

	const options = question.options.map((item) => item.content);
	const duplicates = options.filter(
		(item, _index, self) => self.indexOf(item) !== _index && self.lastIndexOf(item) === _index,
	);

	if (duplicates.length > 0) {
		const duplicateIndices = [
			...new Set(
				duplicates.flatMap((dup) =>
					options.reduce((acc: number[], option, idx) => {
						if (option === dup) acc.push(idx);
						return acc;
					}, []),
				),
			),
		];
		const duplicateOptions = duplicateIndices.map((_index) => String.fromCharCode(65 + _index));
		message.warning(`${index !== undefined ? index + 1 : '该'}题选项${duplicateOptions.join('和')}重复`);
		return false;
	}

	if (question.options.every((item) => !item.isCorrect)) {
		message.warning(`${index !== undefined ? index + 1 : '该'}题未设置正确答案`);
		return false;
	}

	return true;
}

export { checkQuestion };
