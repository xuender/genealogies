import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { TreeService } from "../../tree/tree-service";
import { NodeModal } from "../node-modal/node-modal";

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
  editMySelf(){
    console.log('myself');
    const nm = this.modalCtrl.create(NodeModal, {
      node: Object.assign({}, this.treeService.mySelf)
    });
    nm.present();
    nm.onDidDismiss(node => {
      if (node){
        this.treeService.mySelf = node;
        // Object.assign(this.treeService.mySelf, node);
      }
    });
  }
}
