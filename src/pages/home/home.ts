import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TreeService } from '../../tree/tree-service';
import { Tree } from '../../tree/tree';
import { TreeShow } from '../tree-show/tree-show';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class Home {
	constructor(
		public navCtrl: NavController,
		public treeService: TreeService
	) {
	}
	// 增加家谱
	addTree() {
		this.treeService.add();
	}
	// 打开树
	show(tree: Tree) {
		this.navCtrl.push(TreeShow, {
			tree: tree
		});
	}
}
