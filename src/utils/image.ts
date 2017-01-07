import { enc } from 'crypto-js';

export function pngToBase64(path: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = path;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			// console.debug(canvas.toDataURL('image/png'));
			resolve(canvas.toDataURL('image/png'));
		};
	});
}

export function svgToBase64(svgData: string, width: number, height: number): Promise<string> {
	return new Promise((resolve, reject) => {
			const svg = `<svg width="${width}px" height="${height}px" version="1.1" xmlns="http://www.w3.org/2000/svg">${svgData}</svg>`;
			const words = enc.Utf8.parse(svg);
			const data = enc.Base64.stringify(words);
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const context = canvas.getContext('2d');
			context.fillStyle = '#FFF';
			context.fillRect(0, 0, width, height);
			const image = new Image();
			image.src = `data:image/svg+xml;base64,${data}`;
			image.onload = () => {
				context.drawImage(image, 0, 0);
				// console.debug(canvas.toDataURL('image/png'));
				resolve(canvas.toDataURL('image/png'));
			};
	});
}
