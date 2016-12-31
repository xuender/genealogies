import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DefaultStyle } from './default-style';
import { TreeService } from '../tree/tree-service';
import 'rxjs/add/operator/map';

@Injectable()
export class VerticalStyle extends DefaultStyle {
    constructor(
        public platform: Platform,
        protected treeService: TreeService
    ) {
        super(platform, treeService);
        this.name = '垂丝图';
        this.nodeWidth = 30;
        this.nodeHeight = 80;
        this.writingMode = 'tb';
        this.isFillet = false;
        this.nodeSize = [60, 120];
    }
}
