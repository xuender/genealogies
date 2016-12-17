import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { Calendar } from 'ionic-native';
import { TreeNode } from '../../tree/tree-node';
import { NodeType } from '../../tree/node-type';
import { BackService } from '../../utils/back-service';

/**
 * 节点编辑页面
 */
@Component({
  selector: 'page-node-modal',
  templateUrl: 'node-modal.html'
})
export class NodeModal {
  // 节点
  node: TreeNode;
  // 可选择的父亲或母亲
  others: string[];
  // 父亲或母亲的称呼
  otherTitle: string;
  // 标题
  title: string;
  // 没有关闭按钮
  noClose: boolean;
  parentNode: TreeNode; // 父亲或母亲
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private backService: BackService
  ) {
    this.node = this.params.get('node');
    this.title = this.params.get('title');
    this.noClose = this.params.get('noClose');
    this.others = [];
    if (this.node.nt === NodeType.DEFAULT) { // 子女才需要设置父母
      const tree = this.params.get('tree');
      if (tree) {
        const old = this.params.get('old');
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
    this.backService.trackView('NodeModal');
  }
  // 创建日历提醒
  createDob() {
    this.createCalendar(new Date(this.node.dob), `${this.node.name}生日`);
  }
  // 创建忌日提醒
  createDod() {
    this.createCalendar(new Date(this.node.dod), `${this.node.name}忌日`);
  }
  // 创建提醒
  createCalendar(time: Date, title: string) {
    const now = new Date();
    const start = new Date(now.getTime());
    start.setMonth(time.getMonth());
    start.setDate(time.getDate());
    if (start < now) {  // 已经过去，下年提醒
       start.setMonth(start.getMonth() + 12);
    }
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    const end = new Date(start.getTime());
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    const note = title + ' by 家谱';
    Calendar.createEventInteractivelyWithOptions(
      title, null, note, start, end, {firstReminderMinutes: 60 * 15, recurrence: 'yearly', recurrenceInterval: 1}
    );
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
    this.viewCtrl.dismiss(this.node);
  }
}
