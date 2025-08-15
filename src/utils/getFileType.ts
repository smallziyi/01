function getFileType(
	filename: string,
): 'image' | 'video' | 'audio' | 'pdf' | 'word' | 'excel' | 'ppt' | 'text' | 'html' | 'unknown' | null {
	if (!filename.includes('.')) return null;
	const extension = filename.split('.').pop()!.toLowerCase();

	switch (extension) {
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
			return 'image';
		case 'mp4':
		case 'mkv':
		case 'avi':
		case 'mov':
			return 'video';
		case 'mp3':
		case 'wav':
		case 'm4a':
		case 'flac':
			return 'audio';
		case 'pdf':
			return 'pdf';
		case 'doc':
		case 'docx':
			return 'word';
		case 'xls':
		case 'xlsx':
			return 'excel';
		case 'ppt':
		case 'pptx':
			return 'ppt';
		case 'txt':
			return 'text';
		default:
			return 'unknown';
	}
}

export default getFileType;
