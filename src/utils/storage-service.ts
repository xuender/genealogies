import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
	private prefix: string;

	constructor() {
		this.prefix = 'ender.';
	}

	getItem(key: string, def: any = undefined): any {
		const value = localStorage.getItem(`${this.prefix}${key}`);
		if (value) {
			return JSON.parse(value);
		}
		return def;
	}

	setItem(key: string, value: any) {
		const str = JSON.stringify(value);
		localStorage.setItem(`${this.prefix}${key}`, str);
	}
}
