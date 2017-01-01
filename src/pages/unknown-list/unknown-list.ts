import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ModalController } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { Unknown } from '../../tree/unknown';
import { TreeNode } from '../../tree/tree-node';
import { TreeService } from '../../tree/tree-service';
import { BackService } from '../../utils/back-service';

@Component({
  selector: 'page-unknown-list',
  styles: ['unknown-list.scss'],
  templateUrl: 'unknown-list.html'
})
export class UnknownList {
  familyTree: Tree;
  unknowns: Unknown[];

  constructor(
    public params: NavParams,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private backService: BackService,
    public treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    this.unknowns = Unknown.findUnknowns(this.familyTree);
    this.backService.trackView('UnknownList');
  }

  editNode(node: TreeNode) {
    this.treeService.editNode(node, this.familyTree)
    .then((newNode: TreeNode) => {
      Object.assign(node, newNode);
      this.familyTree.ua = new Date();
      this.unknowns = Unknown.findUnknowns(this.familyTree);
    });
  }

  star(node: TreeNode) {
    node.star = !node.star;
    this.familyTree.ua = new Date();
    this.backService.trackAction('node', 'star');
    this.backService.hold();
  }

  ignore(node: TreeNode) {
    this.alertCtrl.create({
      title: '是否忽略？',
      message: `请问是否忽略${node.name}信息不完全的问题？`,
      buttons: [
        {
          text: '取消'
        },
        {
          text: '忽略',
          handler: () => {
            node.ignore = true;
            this.familyTree.ua = new Date();
            this.unknowns = Unknown.findUnknowns(this.familyTree);
            this.backService.trackAction('node', 'ignore');
            this.backService.hold();
          }
        }
      ]
    }).present();
  }
}
