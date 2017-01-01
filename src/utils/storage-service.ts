import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    // 前缀
    private prefix: string;
    constructor() {
        // TODO 临时名称
        this.prefix = 'ng2-webstorage|';
    }
    public getItem(key: string, def: any = undefined): any {
        const value = localStorage.getItem(`${this.prefix}${key}`);
        if (value) {
            return JSON.parse(value);
        }
        return def;
    }
    public setItem(key: string, value: any) {
        const str = JSON.stringify(value);
        localStorage.setItem(`${this.prefix}${key}`, str);
    }
}
