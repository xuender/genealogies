import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { TreeService } from '../../tree/tree-service';
import { NodeModal } from '../node-modal/node-modal';
import { BackService } from '../../utils/back-service';

@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class Setting {
	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public backService: BackService,
		public treeService: TreeService
	) {
		this.backService.trackView('Setting');
	}

	editMySelf() {
		console.log('myself');
		const nm = this.modalCtrl.create(NodeModal, {
			node: Object.assign({}, this.treeService.mySelf),
			title: '个人信息设置'
		});
		nm.onDidDismiss(node => {
			if (node) {
				this.treeService.mySelf = node;
			}
		});
		nm.present();
	}
}
