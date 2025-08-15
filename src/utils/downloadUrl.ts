/**
 * 下载给定的URL资源并命名为指定的文件名。
 * @param url 资源的URL，必须是有效的URL字符串。
 * @param fileName 下载后文件的命名，不能包含任何路径分隔符或控制字符。
 */
const downloadUrl = (url: string, fileName: string) => {
	try {
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		// 隐藏链接，避免界面混乱
		a.style.display = 'none';
		document.body.appendChild(a);
		// 触发下载
		a.click();
		// 清理DOM
		setTimeout(() => {
			document.body.removeChild(a);
		}, 0);
	} catch (error) {
		// 处理可能的异常，比如URL不合法、网络问题等
		throw error;
	}
};
export default downloadUrl;
