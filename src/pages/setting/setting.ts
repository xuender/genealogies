import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { LocalStorage } from 'ng2-webstorage';
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
  @LocalStorage()
  public maleFirst: boolean;
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
      node: Object.assign({}, this.treeService.mySelf)
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
