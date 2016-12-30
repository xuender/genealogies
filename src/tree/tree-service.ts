import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';

import * as uuid from 'uuid';
// import { LocalStorage } from 'ng2-webstorage';

import { Tree } from './tree';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { TreeNode , nodeEach } from './tree-node';
import { NodeType } from './node-type';
import { NodeModal } from '../pages/node-modal/node-modal';
import { StorageService } from '../utils/storage-service';
import { BackService } from '../utils/back-service';
import { remove } from '../utils/array';

@Injectable()
export class TreeService {
  private _maleFirst: boolean;
  set maleFirst(v: boolean) {
    this._maleFirst = v;
    this.storageService.setItem('maleFirst', v);
  }
  get maleFirst(): boolean {
    return this._maleFirst;
  }

  private _style: number;
  get style(): number {
    return this._style;
  }
  set style(v: number) {
    this._style = v;
    this.storageService.setItem('style', v);
  }

  private _trees: Tree[];
  copyNode: TreeNode;
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
    } else {
      this._trees = this.storageService.getItem('_trees', []);
    }
    return this._trees;
  }
  set trees(trees: Tree[]){
    for (const t of trees) {
      t.totalNum = 0;
      t.aliveNum = 0;
      nodeEach(t.root, (n: TreeNode) => {
        t.totalNum += 1;
        if (!n.dead) {
          t.aliveNum += 1;
        }
      });
    }
    this._trees = trees;
    this.storageService.setItem('_trees', trees);
  }
  public get mySelf(): TreeNode {
    return this.storageService.getItem('myself');
  }
  public set mySelf(v: TreeNode) {
    this.storageService.setItem('myself', v);
  }
  private loadTime: Date;
  constructor(
    private http: Http,
    private modalCtrl: ModalController,
    private backService: BackService,
    private storageService: StorageService
  ) {
    this._style = this.storageService.getItem('style', 1);
    this._maleFirst = this.storageService.getItem('maleFirst', true);
    if (!this.mySelf) {
      this.mySelf = {
        name: '无名氏',
        gender: true,
        nt: NodeType.DEFAULT,
        star: true
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
    this.backService.trackAction('tree', 'add');
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
    remove(this.trees, (t: Tree) => tree.id === t.id);
    this.backService.trackAction('tree', 'del');
  }
}
