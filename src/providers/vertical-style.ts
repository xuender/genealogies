import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DefaultStyle } from './default-style';
import 'rxjs/add/operator/map';

@Injectable()
export class VerticalStyle extends DefaultStyle {
    constructor(
        public platform: Platform
    ) {
        super(platform);
        this.nodeWidth = 30;
        this.nodeHeight = 80;
        this.writingMode = 'tb';
        this.isFillet = false;
        this.nodeSize = [60, 120];
    }
    name(): string {
        return '垂丝图';
    }
}
