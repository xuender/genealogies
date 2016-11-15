import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TreeService } from "../../tree/tree-service";
import { Tree } from "../../tree/tree";
import { TreeShow } from "../tree-show/tree-show";

/**
 * 族谱、回忆录、照片、消息等汇总的地方
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  trees: Tree[];
  constructor(
    public navCtrl: NavController,
    private treeService: TreeService
  ) {
    // this.trees = treeService.trees.slice(0, 3);
    this.trees = treeService.trees;
  }
  // 增加家谱
  addTree() {
    this.treeService.add();
  }
  // 打开树
  show(tree: Tree) {
    console.debug('展示:', tree.title);
    this.navCtrl.push(TreeShow, {
      tree: tree
    });
  }
}
