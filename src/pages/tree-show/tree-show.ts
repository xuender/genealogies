import { Component } from '@angular/core';
import { ToastController, NavController, NavParams, ViewController, FabContainer, ModalController } from 'ionic-angular';
import { SocialSharing, Clipboard } from 'ionic-native';
import { LocalStorage } from 'ng2-webstorage';

import { Tree } from '../../tree/tree';
import { TreeNode, nodeToStr, strToNode } from '../../tree/tree-node';
import { NodeType } from '../../tree/node-type';
import { TreeService } from '../../tree/tree-service';
import { DefaultStyle } from '../../tree/default-style';
import { TreeStyle , createStyle } from '../../tree/tree-style';

/**
 * 家谱编辑页面
 */
@Component({
  selector: 'page-tree-show',
  styles: ['tree-show.scss'],
  templateUrl: 'tree-show.html'
})
export class TreeShow {
  // 家谱
  familyTree: Tree;
  // 选择的节点数据
  selectNode: TreeNode;
  // 操作按钮
  fat: FabContainer;
  // 家谱式样
  treeStyle: TreeStyle;
  @LocalStorage()
  public maleFirst: boolean;
  // 复制节点
  copyNode: TreeNode;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    console.debug('tree show', this.familyTree.title);
  }
  paste1() {
    this.paste(NodeType.DEFAULT);
  }
  paste2() {
    this.paste(NodeType.CONSORT);
  }
  // 粘贴
  paste(nt: NodeType) {
    this.copyNode.nt = nt;
    if (!this.selectNode.children) {
      this.selectNode.children = [];
    }
    this.selectNode.children.push(this.copyNode);
    this.treeStyle.show(this.maleFirst);
  }
  // 复制
  copy() {
    this.fat.close();
    // 复制节点
    const cn = JSON.parse(JSON.stringify(this.selectNode));
    if (cn.nt !== NodeType.DEFAULT) {
      // 复制伴侣
      if (!cn.children) {
        cn.children = [];
      }
      const b = JSON.parse(JSON.stringify(this.treeStyle.selectNode.parent.data));
      delete b.children;
      b.nt = cn.nt;
      cn.children.push(b);
      // 如果是配偶则复制配偶的后裔
      for (const c of this.treeStyle.selectNode.parent.data.children) {
        if (c.other === cn.name) {
          const o = JSON.parse(JSON.stringify(c));
          o.other = b.name;
          cn.children.push(o);
        }
      }
    }
    const toast = this.toastCtrl.create({
      message: `${this.selectNode.name}及其后裔已经复制，等待粘贴。`,
      position: 'middle',
      duration: 3000
    });
    toast.present();
    Clipboard.copy(nodeToStr(cn));
  }
  // 是否选择根节点
  isRoot() {
    return this.selectNode && this.treeStyle && this.treeStyle.isRoot();
  }
  // 默认节点
  isDefault() {
    return this.selectNode
    && (!('nt' in this.selectNode) || this.selectNode.nt === NodeType.DEFAULT);
  }
  // 显示家谱信息
  info() {
    this.treeService.edit(this.familyTree)
    .then((tree: Tree) => this.treeStyle.show(this.maleFirst));
  }
  // 修改返回按钮
  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }
  // 初始化之后
  ngAfterViewInit() {
    // 创建家谱默认式样
    this.treeStyle = createStyle(DefaultStyle, this.familyTree, '#tree', this.maleFirst);
    // 绑定点击节点动作
    this.treeStyle.clickNodeListener((node: TreeNode) => {
      this.selectNode = node;
      if (this.fat) {
        this.fat.close();
      }
    });
    // 显示家谱
    this.treeStyle.show(this.maleFirst);
    console.log(nodeToStr(this.selectNode));
  }
  // 设置浮动按钮
  setFat(fat: FabContainer) {
    this.fat = fat;
    Clipboard.paste()
    .then((str: string) => this.copyNode = strToNode(str));
  }
  // 共享文字
  shareText() {
    this.fat.close();
    SocialSharing.share(
      nodeToStr(this.selectNode),
      this.familyTree.title,
      null,
    );
  }
  // 显示删除按钮
  showRemove(): boolean {
    return this.treeStyle && this.treeStyle.isDeleted();
  }
  // 编辑节点
  editNode() {
    this.fat.close();
    this.treeService.editNode(this.selectNode, this.familyTree)
    .then((node) => this.treeStyle.show(this.maleFirst));
  }
  // 增加伴侣
  addConsort() {
    console.debug('增加伴侣:', this.selectNode.name);
    if (!this.selectNode.children) {
      this.selectNode.children = [];
    }
    this.selectNode.children.push({
      name: `${this.selectNode.name}的${this.selectNode.gender ? '妻子' : '丈夫'}`,
      gender: !this.selectNode.gender,
      nt: NodeType.CONSORT,
    });
    this.familyTree.ua = new Date();
    this.treeStyle.show(this.maleFirst);
  }
  // 增加子女
  addChildren() {
    console.debug('增加子女:', this.selectNode.name);
    if (!this.selectNode.children) {
      this.selectNode.children = [];
    }
    this.selectNode.children.push({
      name: `${this.selectNode.name}的儿子`,
      gender: true,
      nt: NodeType.DEFAULT,
    });
    this.familyTree.ua = new Date();
    this.treeStyle.show(this.maleFirst);
  }
  // 删除节点
  removeNode() {
    this.fat.close();
    console.debug('删除节点:', this.selectNode.name);
    this.treeStyle.removeNode();
  }
  // 增加父亲
  addParent() {
    console.debug('增加父亲:', this.selectNode.name);
    const root = {
      name: `${this.selectNode.name}的父亲`,
      gender: true,
      nt: NodeType.DEFAULT,
      children: [this.familyTree.root],
    };
    this.familyTree.root = root;
    this.familyTree.ua = new Date();
    this.treeStyle.show(this.maleFirst);
  }
}
