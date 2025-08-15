import theme from '@/theme.ts';

const appTheme = ref<'white' | 'blue'>('white');

function useAppTheme() {
	appTheme.value = (sessionStorage.getItem('theme_type') as 'white' | 'blue') || 'white';
	function setAppTheme(theme: 'white' | 'blue') {
		appTheme.value = theme;
		sessionStorage.setItem('theme_type', appTheme.value);
	}

	return {
		appTheme,
		setAppTheme,
		token:
			appTheme.value === 'blue'
				? theme.kejilanTheme
				: appTheme.value === 'white'
					? theme.zhaolubaiTheme
					: theme.defaultTheme,
	};
}

export default useAppTheme;
