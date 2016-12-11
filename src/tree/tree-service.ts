import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';

import * as uuid from 'uuid';

import { Tree } from './tree';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { TreeNode, nodeEach } from './tree-node';
import { NodeType } from './node-type';
import { LocalStorage } from 'ng2-webstorage';
import { Unknown } from './unknown';
import { NodeModal } from '../pages/node-modal/node-modal';

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
      this.init();
    }
    this.loadTime = new Date();
  }
  // 编辑节点
  editNode(node: TreeNode, tree: Tree): Promise<TreeNode> {
    return new Promise<TreeNode>((resolve, reject) => {
      console.debug('编辑节点:', node.name);
      const nm = this.modalCtrl.create(NodeModal, {
        node: Object.assign({}, node),
        old: node,
        tree: tree
      });
      nm.present();
      nm.onDidDismiss(newNode => {
        if (newNode) {
          Object.assign(node, newNode);
          if (tree) {
            tree.ua = new Date();
          }
          resolve(node);
        }
      });
    });
  }
  // 首次初始化
  init() {
    console.log('用户初始化');
    const nm = this.modalCtrl.create(NodeModal, {
      node: Object.assign({}, this.mySelf),
      title: '个人信息设置',
      noClose: true
    });
    nm.onDidDismiss(node => {
      if (node) {
        this.mySelf = node;
      }
      if (!this.trees) {
        this.trees = [this.getNewTree()];
      }
    });
    nm.present();
  }
  // 判断是否有变化，触发set 方法
  get trees() {
    if (this._trees) {
      for (const t of this._trees) {
        if (t.ua > this.loadTime) {
          console.log('保存：', t.ua, this.loadTime);
          this.loadTime = new Date();
          this.trees = this._trees;
          break;
        }
      }
    }
    return this._trees;
  }
  // 家谱问题
  unknown(tree: Tree): Unknown[] {
    const us: Unknown[] = [];
    tree.unknown = 0;
    nodeEach(tree.root, (n: TreeNode) => {
      const unknowns: string[] = [];
      for (const s of ['无名', '妻子', '丈夫', '父亲', '奶奶', '祖母', '儿子', '妈妈', '女儿', '姐姐', '哥哥', '爷爷', '祖父']) {
        if (n.name.indexOf(s) >= 0) {
          unknowns.push('姓名不确定');
          break;
        }
      }
      if (!n.dob) {
        unknowns.push('出生日期未知');
      }
      if (n.dead && !n.dod) {
        unknowns.push('忌日未知');
      }
      // TODO 妻子未知
      // TODO other未知
      if (unknowns.length > 0) {
        n.unknown = unknowns.length;
        tree.unknown += n.unknown;
        us.push({
          node: n,
          unknown: unknowns
        });
      }
    });
    us.sort((a: Unknown, b: Unknown) => a.node.star === b.node.star ? 0 : a.node.star ? -1 : 1);
    return us;
  }
  // 家谱统计
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
