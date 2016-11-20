import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';
import { Tree } from "./tree";
import { TreeModal } from "../pages/tree-modal/tree-modal";
import { TreeNode } from "./tree-node";

/**
 * 家谱服务
 */
@Injectable()
export class TreeService {
  private _trees: Tree[];
  private _mySelf: TreeNode;
  // 本人
  get mySelf(): TreeNode {
    if (this._mySelf) {
      return this._mySelf;
    }
    this._mySelf = {
      name: '本人',
      ca: new Date(),
      ua: new Date(),
    }
    return this._mySelf;
  }
  // 家谱列表
  get trees(): Tree[] {
    if (this._trees) {
      return this._trees;
    }
    console.debug('网络获取家谱');
    // TODO 网络获取
    this._trees = [];
    for (let i = 0; i < 5; i++) {
      this._trees.push({
        id: `${i}`,
        title: `title-${i}`,
        note: `note-${i}`,
        root: {
          name: `root${i}`,
          children: [
            {name: 'ff',
              children:[
                {name: 'ffa'},
                {name: 'ffb'}
              ]
            },
            {name: 'kk',
              children:[
                {name: 'kkb'}
              ]
            }
          ]},
        ca: new Date(),
        ua: new Date(),
      })
    }
    return this._trees;
  }
  constructor(
    private http: Http,
    private modalCtrl: ModalController
  ) {
  }
  // 增加家谱
  public add() {
    console.debug('增加家谱');
    this.edit({
      id: `${new Date()}`,
      title: '新家谱',
      note: '',
      root: {name: '本人'},
      ca: new Date(),
      ua: new Date(),
    });
  }
  // 编辑家谱
  public edit(tree: Tree){
    console.debug('保存家谱:', tree.title);
    const treeModal = this.modalCtrl.create(TreeModal, {tree: tree});
    treeModal.onDidDismiss(data => {
      if (data) {
        if(this.isNew(data)){
          console.debug('新增');
          // TODO 远程调用
          this.trees.push(data);
        } else {
          console.debug('修改');
          // TODO 远程调用
          data.ua = new Date();
          this.trees.forEach(t => {
            if (t.id == data.id){
              Object.assign(t, data);
            }
          });
        }
      }
    });
    treeModal.present();
  }
  private isNew(tree: Tree) {
    for(const t of this.trees){
      if (tree.id == t.id){
        return false;
      }
    }
    return true;
  }
  // 删除家谱
  public del(tree: Tree) {
    console.debug('删除家谱:', tree.title);
    const is: number[] = [];
    for (let i=0;i<this.trees.length;i++){
      if(this.trees[i].id === tree.id){
        is.push(i);
      }
    }
    for(const i of is.reverse()){
      this.trees.splice(i, 1);
    }
  }
}
