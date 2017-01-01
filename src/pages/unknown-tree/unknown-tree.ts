import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { TreeService } from '../../tree/tree-service';
import { BackService } from '../../utils/back-service';
import { UnknownList } from '../unknown-list/unknown-list';

@Component({
  selector: 'page-unknown-tree',
  templateUrl: 'unknown-tree.html'
})
export class UnknownTree {
  constructor(
    public navCtrl: NavController,
    private backService: BackService,
    public treeService: TreeService
  ) {
    this.backService.trackView('UnknownTree');
  }

  show(tree: Tree) {
    this.navCtrl.push(UnknownList, {
      tree: tree
    });
  }
}
