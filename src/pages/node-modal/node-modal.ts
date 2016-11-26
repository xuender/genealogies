import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { TreeNode } from '../../tree/tree-node';
import { NodeType } from '../../tree/node-type';
import { NoticeService } from '../../notice/notice-service';

/**
 * 节点编辑页面
 */
@Component({
  selector: 'page-node-modal',
  templateUrl: 'node-modal.html'
})
export class NodeModal {
  node: TreeNode;
  // 可选择的父亲或母亲
  others: string[];
  // 父亲或母亲的称呼
  otherTitle: string;
  parentNode: TreeNode; // 父亲或母亲
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private noticeService: NoticeService
  ) {
    this.node = this.params.get('node');
    this.others = [];
    if (this.node.nt === NodeType.DEFAULT) { // 子女才需要设置父母
      const tree = this.params.get('tree');
      const old = this.params.get('old');
      if (tree) {
        this.setParent(tree.root, old);
        if (this.parentNode) {
          this.otherTitle = this.parentNode.gender ? '母亲' : '父亲';
          for (const c of this.parentNode.children) {
            if (c.nt !== NodeType.DEFAULT) {
              this.others.push(c.name);
            }
          }
        }
      }
    }
  }
  get isDobn(): boolean {
    return this.node.dobn !== undefined && this.node.dobn !== '';
  }
  set isDobn(b: boolean) {
    console.log('isdobn', b);
    if (b) {
      const n = this.noticeService.create(`${this.node.name}生日`, new Date(this.node.dob));
      this.node.dobn = n.id;
    } else {
      this.noticeService.remove(this.node.dobn);
      this.node.dobn = '';
    }
  }
  // 设置父节点
  setParent(root: TreeNode, node: TreeNode) {
    if (root.children) {
      for (const c of root.children) {
        if (c === node) {
          this.parentNode = root;
          return;
        }
        this.setParent(c, node);
      }
    }
  }
  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
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
    this.node.ua = new Date();
    this.viewCtrl.dismiss(this.node);
  }
}
