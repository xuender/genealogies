import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { TreeService } from '../../tree/tree-service';
import { UnknownList } from '../unknown-list/unknown-list';

/**
 * 未知问题家谱
 */
@Component({
  selector: 'page-unknown-tree',
  templateUrl: 'unknown-tree.html'
})
export class UnknownTree {
  constructor(
    public navCtrl: NavController,
    public treeService: TreeService
  ) {
  }
  // 打开树
  show(tree: Tree) {
    console.debug('问题列表:', tree.title);
    this.navCtrl.push(UnknownList, {
      tree: tree
    });
  }
}
