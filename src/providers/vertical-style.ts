import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { DefaultStyle } from './default-style';
import { TreeService } from '../tree/tree-service';

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
