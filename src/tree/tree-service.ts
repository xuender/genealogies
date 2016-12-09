import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';

import * as uuid from 'uuid';

import { Tree } from './tree';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { TreeNode } from './tree-node';
import { NodeType } from './node-type';
import { LocalStorage } from 'ng2-webstorage';
import { Unknown } from './unknown';

/**
 * 家谱服务
 */
@Injectable()
export class TreeService {
  @LocalStorage()
  public _trees: Tree[];
  @LocalStorage()
  public mySelf: TreeNode;
  private loadTime: Date;
  // 复制的节点
  copyNode: TreeNode;
  get trees() {
    // 判断是否有变化，触发set 方法
    if (this._trees) {
      for (const t of this._trees) {
        if (t.ua > this.loadTime) {
          this.loadTime = new Date();
          this.trees = this._trees;
          break;
        }
      }
    }
    return this._trees;
  }
  query(node: TreeNode, unknowns: Unknown[]) {
      unknowns.push({
          node: node,
          unknown: ['xxx', 'fff']
      })
      if (node.children) {
          for (const c of node.children) {
              this.query(c, unknowns);
          }
      }
  }
  // 家谱问题
  unknown(tree: Tree): Unknown[] {
      const us: Unknown[] = [];
      this.query(tree.root, us);
      return us;
  }
  count(node: TreeNode, tree: Tree) {
    // console.debug('count', node);
    tree.totalNum += 1;
    if (!node.dead) {
      tree.aliveNum += 1;
    }
    if (node.children) {
      for (const n of node.children) {
        this.count(n, tree);
      }
    }
  }
  set trees(trees: Tree[]){
    for (const t of trees) {
       t.totalNum = 0;
       t.aliveNum = 0;
       this.count(t.root, t);
    }
    this._trees = trees;
  }
  constructor(
    private http: Http,
    private modalCtrl: ModalController
  ) {
    if (!this.mySelf) {
      this.mySelf = {
        name: '无名氏',
        gender: true,
        nt: NodeType.DEFAULT,
      };
    }
    this.loadTime = new Date();
    if (!this.trees) {
      this.trees = [this.getNewTree()];
    }
  }
  // 新家谱
  getNewTree() {
    return {
      id: uuid(),
      title: `${this.mySelf.name === '无名氏' ? '无名' : this.mySelf.name[0]}氏家谱`,
      note: '',
      root: this.mySelf,
      ca: new Date(),
      ua: new Date(),
    };
  }
  // 增加家谱
  public add() {
    console.debug('增加家谱');
    this.edit(this.getNewTree());
  }
  // 编辑家谱
  public edit(tree: Tree): Promise<Tree> {
    console.debug('保存家谱:', tree.title);
    return new Promise((resolve, reject) => {
      const treeModal = this.modalCtrl.create(TreeModal, {tree: Object.assign({}, tree)});
      treeModal.onDidDismiss(data => {
        if (data) {
          if (this.isNew(data)) {
            console.debug('新增');
            // TODO 远程调用
            this.trees.push(data);
            resolve(data);
          } else {
            console.debug('修改');
            // TODO 远程调用
            data.ua = new Date();
            this.trees.forEach(t => {
              if (t.id === data.id) {
                Object.assign(t, data);
                resolve(t);
              }
            });
          }
        }
      });
      treeModal.present();
    });
  }
  private isNew(tree: Tree) {
    for (const t of this.trees) {
      if (tree.id === t.id) {
        return false;
      }
    }
    return true;
  }
  // 删除家谱
  public del(tree: Tree) {
    console.debug('删除家谱:', tree.title);
    const is: number[] = [];
    for (let i = 0; i < this.trees.length; i++) {
      if (this.trees[i].id === tree.id) {
        is.push(i);
      }
    }
    for (const i of is.reverse()) {
      this.trees.splice(i, 1);
    }
  }
}
