import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { BackService } from '../../utils/back-service';

/**
 * 家谱编辑页面
 */
@Component({
  selector: 'page-tree-modal',
  templateUrl: 'tree-modal.html'
})
export class TreeModal {
  tree: Tree;
  constructor(
    public params: NavParams,
    private backService: BackService,
    public viewCtrl: ViewController
  ) {
    this.tree = this.params.get('tree');
    console.debug('tree modal', this.tree);
    this.backService.trackView('TreeModal');
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
    this.viewCtrl.dismiss(this.tree);
  }
}
