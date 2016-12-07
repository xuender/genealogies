import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Tree } from '../../tree/tree';
import { TreeService } from '../../tree/tree-service';

/**
 * 家谱问题列表
 */
@Component({
  selector: 'page-unknown-list',
  templateUrl: 'unknown-list.html'
})
export class UnknownList {
  constructor(
    public navCtrl: NavController,
    public treeService: TreeService
  ) {
  }
  // 打开树
  show(tree: Tree) {
    console.debug('展示:', tree.title);
    // this.navCtrl.push(TreeShow, {
    //   tree: tree
    // });
  }
}
