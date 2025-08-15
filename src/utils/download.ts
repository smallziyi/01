const download = (fileId: string) => {
	const a = document.createElement('a');
	a.href = `${window.config.file}/download?fileId=${fileId}&token=${sessionStorage.getItem('jwt')}`;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
	}, 0);
};
export default download;
