import { Component } from '@angular/core';

import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Tree } from '../../tree/tree';
import { TreeService } from '../../tree/tree-service';
import { Unknown } from '../../tree/unknown';

/**
 * 家谱问题列表
 */
@Component({
  selector: 'page-unknown-list',
  templateUrl: 'unknown-list.html'
})
export class UnknownList {
  // 家谱
  familyTree: Tree;
  // 问题列表
  unknowns: Unknown[];
  constructor(
    public params: NavParams,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    this.unknowns = this.treeService.unknown(this.familyTree);
  }
}
