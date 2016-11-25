import { Component } from '@angular/core';

import { ItemSliding, NavController } from 'ionic-angular';
import { Tree } from '../../tree/tree';
import { TreeService } from '../../tree/tree-service';
import { TreeShow } from '../tree-show/tree-show';

/**
 * 家谱
 */
@Component({
  selector: 'page-tree-list',
  templateUrl: 'tree-list.html'
})
export class TreeList {
  isDel: boolean;
  constructor(
    public navCtrl: NavController,
    public treeService: TreeService
  ) {
    this.isDel = false;
  }
  // 增加家谱
  add() {
    this.treeService.add();
  }
  // 删除家谱
  del(tree: Tree) {
    this.treeService.del(tree);
  }
  // 编辑
  edit(tree: Tree, item: ItemSliding) {
    this.treeService.edit(tree);
    item.close();
  }
  // 打开树
  show(tree: Tree) {
    console.debug('展示:', tree.title);
    this.navCtrl.push(TreeShow, {
      tree: tree
    });
  }
}
