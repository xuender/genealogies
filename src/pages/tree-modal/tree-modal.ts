import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { BackService } from '../../utils/back-service';

@Component({
	selector: 'page-tree-modal',
	templateUrl: 'tree-modal.html'
})
export class TreeModal {
	tree: Tree;

	constructor(
		public params: NavParams,
		private backService: BackService,
		public viewCtrl: ViewController
	) {
		this.tree = this.params.get('tree');
		this.backService.trackView('TreeModal');
	}

	cancel() {
		this.viewCtrl.dismiss();
		this.backService.touch();
	}

	ok() {
		this.viewCtrl.dismiss(this.tree);
		this.backService.touch();
	}
}
