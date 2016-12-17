import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
// import { LocalStorage } from 'ng2-webstorage';
import { TreeService } from '../../tree/tree-service';
import { NodeModal } from '../node-modal/node-modal';

/**
 * 家谱
 */
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class Setting {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public treeService: TreeService
  ) {
  }
  // 编辑个人信息
  editMySelf() {
    console.log('myself');
    const nm = this.modalCtrl.create(NodeModal, {
      node: Object.assign({}, this.treeService.mySelf),
      title: '个人信息设置'
    });
    nm.present();
    nm.onDidDismiss(node => {
      if (node) {
        this.treeService.mySelf = node;
        // Object.assign(this.treeService.mySelf, node);
      }
    });
  }
}
