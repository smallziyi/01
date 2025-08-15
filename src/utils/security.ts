import { v4 as uuid } from 'uuid';

// @ts-ignore
import { Snowyflake, Epoch } from 'snowyflake';

const snowyflake = new Snowyflake({
	workerId: 1n,
	epoch: Epoch.Twitter, // BigInt timestamp
});

const security = {
	desensitized: (value: string | number, type: 'name' | 'phone' | 'email' | 'idCard') => {
		switch (type) {
			case 'name':
				return value.toString().replace(/.(?=.)/g, '*');
			case 'phone':
				return value.toString().replace(/(\d{3})\d*(\d{4})/, '$1****$2');
			case 'email':
				return value.toString().replace(/(.{2}).+(@.+)/, '$1****$2');
			case 'idCard':
				return value.toString().replace(/(\d{6})\d*(\d{4})/, '$1********$2');
			default:
				return value;
		}
	},
	uuid: () => {
		return uuid().replace(/-/g, '');
	},
	snowflakeId: () => snowyflake.nextId(),
	base64: (value: string) => {
		return window.btoa(value);
	},
	base64Decode: <T>(value: string) => {
		return JSON.parse(window.atob(value) || '{}') as T;
	},
};

export default security;
