import { Component } from '@angular/core';
import { AlertController, ItemSliding, NavController } from 'ionic-angular';

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
        private alertController: AlertController,
        public treeService: TreeService
    ) {
        this.isDel = false;
        this.backService.trackView('TreeList');
    }

    add() {
        this.treeService.add();
    }

    del(tree: Tree) {
        this.alertController.create({
            title: '删除家谱',
            subTitle: `是否确认删除家谱 [ ${tree.title} ] ？`,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel'
                },
                {
                    text: '确认删除',
                    handler: () => this.treeService.del(tree)
                }
            ]
        }).present();
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
