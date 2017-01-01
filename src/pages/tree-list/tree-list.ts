import { Component } from '@angular/core';
import { ItemSliding, NavController } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { TreeShow } from '../tree-show/tree-show';
import { TreeService } from '../../tree/tree-service';
import { BackService } from '../../utils/back-service';

@Component({
  selector: 'page-tree-list',
  templateUrl: 'tree-list.html'
})
export class TreeList {
  isDel: boolean;

  constructor(
    public navCtrl: NavController,
    private backService: BackService,
    public treeService: TreeService
  ) {
    this.isDel = false;
    this.backService.trackView('TreeList');
  }

  add() {
    this.treeService.add();
  }

  del(tree: Tree) {
    this.treeService.del(tree);
  }

  edit(tree: Tree, item: ItemSliding) {
    this.treeService.edit(tree);
    item.close();
  }

  show(tree: Tree) {
    this.navCtrl.push(TreeShow, {
      tree: tree
    });
  }
}
