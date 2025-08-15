const downloadBatch = (fileIds: string[]) => {
	const a = document.createElement('a');
	a.href = `${window.config.file}/downloadBatch?fileIds=${fileIds}&token=${sessionStorage.getItem('jwt')}`;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	setTimeout(() => {
		document.body.removeChild(a);
	}, 0);
};
export default downloadBatch;
