import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { TreeNode } from "../../tree/tree-node";

/**
 * 节点编辑页面
 */
@Component({
  selector: 'page-node-modal',
  templateUrl: 'node-modal.html'
})
export class NodeModal {
  node: TreeNode;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.node = this.params.get('node');
  }
  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }
  /**
   * 取消
   */
  cancel() {
    console.debug('cancel');
    this.viewCtrl.dismiss();
  }
  /**
   * 确定
   */
  ok() {
    console.debug('ok');
    this.node.ua = new Date();
    this.viewCtrl.dismiss(this.node);
  }
}
