<script lang="ts" setup>
import * as xlsx from 'xlsx';
import { initUser } from '@/view/base/user/schoolUser.ts';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import useAxios from '@/axios';
// import { regexConfig } from '@/config/regex.ts';

const axios = useAxios();

const props = defineProps<{ userType: 'teacher' | 'student' | 'leader' | 'company' }>();
const emit = defineEmits(['success']);
const input = ref<HTMLInputElement>();
const form = ref<HTMLFormElement>();
const handleClick = () => {
	userList.value = [];
	form.value?.reset();
	setTimeout(() => {
		input.value?.click();
	}, 0);
};
const handleInput = () => {
	const file = input.value?.files?.item(0);
	const reader = new FileReader();
	reader.readAsArrayBuffer(file!);
	reader.onloadend = (event) => {
		const workBook = xlsx.read(event.target!.result);
		const data = workBook.Sheets[workBook.SheetNames[0]];
		const workSheet: Array<Array<string>> = xlsx.utils.sheet_to_json(data, { header: 1 }).splice(1) as Array<
			Array<string>
		>;
		workSheet.forEach((item) => {
			const user = initUser(props.userType);
			user.name = item[0];
			user.number = item[1];
			user.gender = item[2] === '男' ? 1 : 0;
			user.phone = item[3];
			user.idCard = item[4];
			if (item[5].includes('/')) {
				const date = item[5].split('/');
				user.birthday = dayjs()
					.set('year', Number(date[0]))
					.set('month', Number(date[1]))
					.set('day', Number(date[2]))
					.toString();
			} else if (item[5].includes('-')) {
				const date = item[5].split('-');
				user.birthday = dayjs()
					.set('year', Number(date[0]))
					.set('month', Number(date[1]))
					.set('day', Number(date[2]))
					.toString();
			} else {
				user.birthday = dayjs()
					.set('year', Number(item[5].slice(0, 4)))
					.set('month', Number(item[5].slice(4, 6)))
					.set('day', Number(item[5].slice(6, 8)))
					.toString();
			}
			user.nativePlace = item[6];
			user.address = item[7];
			user.email = item[8];
			user.disable = item[9] === '禁用';
			userList.value.push(user);
		});

		// const result = findDuplicates<User>(userList.value, 'phone', 'idCard', 'number', 'email');
		let flag = true;
		// if (result.phone.length !== 0) {
		// 	const _message = result.phone.map((item) => {
		// 		return `第${item.map((i) => i + 1).join('、')}行重复`;
		// 	});
		// 	flag = false;
		// 	message.warn(`手机号码：${_message.join(';')}`);
		// }
		// dif (result.email.length !== 0) {
		// 	const _message = result.phone.map((item) => {
		// 		return `第${item.map((i) => i + 1).join('、')}行重复`;
		// 	});
		// 	flag = false;
		// 	message.warn(`邮箱账号：${_message.join(';')}`);
		// }
		// if (result.idCard.length !== 0) {
		// 	const _message = result.phone.map((item) => {
		// 		return `第${item.map((i) => i + 1).join('、')}行重复`;
		// 	});
		// 	flag = false;
		// 	message.warn(`身份证号：${_message.join(';')}`);
		// }
		// if (result.number.length !== 0) {
		// 	const _message = result.phone.map((item) => {
		// 		return `第${item.map((i) => i + 1).join('、')}行重复`;
		// 	});
		// 	flag = false;
		// 	message.warn(`学号（工号）：${_message.join(';')}`);
		// }
		// let counter = 1;
		// userList.value.forEach((item) => {
		// 	if (!regexConfig.idCard.test(item.idCard)) {
		// 		message.warn(`第${counter}行：用户${item.name}的身份证号格式不正确，请检查`);
		// 		counter += 1;
		// 		flag = false;
		// 	}
		// });
		if (flag) {
			message.loading('数据已上传，请等待');
			axios
				.post('/base/user/addUsersCreateRoleAuth', userList.value, { timeout: 0 })
				.then(() => {
					emit('success');
					message.success('添加完成');
				})
				.finally(() => {
					form.value?.reset();
				});
		}
	};
};

const userList = ref<Array<User>>([]);

// function findDuplicates<T>(items: T[], ...keys: Array<keyof T>): Record<(typeof keys)[number], Array<Array<number>>> {
// 	type KeyType = (typeof keys)[number];
//
// 	const valueMaps = new Map<KeyType, Map<unknown, number[]>>();
//
// 	keys.forEach((key) => {
// 		valueMaps.set(key, new Map<unknown, number[]>());
// 	});
//
// 	items.forEach((item, index) => {
// 		keys.forEach((key) => {
// 			const value = item[key];
// 			const map = valueMaps.get(key)!;
// 			const indices = map.get(value) || [];
// 			indices.push(index);
// 			map.set(value, indices);
// 		});
// 	});
//
// 	const result = {} as Record<KeyType, Array<Array<number>>>;
//
// 	valueMaps.forEach((map, key) => {
// 		result[key] = Array.from(map.values()).filter((indices) => indices.length > 1);
// 	});
//
// 	return result;
// }
</script>

<template>
	<a-button size="small" type="link" @click="handleClick">批量导入</a-button>
	<form ref="form" class="hidden">
		<input ref="input" accept=".xlsx" type="file" @input="handleInput" />
	</form>
</template>

<style scoped></style>
