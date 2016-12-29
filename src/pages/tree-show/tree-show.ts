import { Component } from '@angular/core';
import { ToastController, NavController, NavParams, ViewController, FabContainer, ModalController } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';
// import { LocalStorage } from 'ng2-webstorage';
import { TreeService } from '../../tree/tree-service';

import { Tree } from '../../tree/tree';
import { TreeNode, nodeToStr, strToNode } from '../../tree/tree-node';
import { NodeType } from '../../tree/node-type';
import { DefaultStyle } from '../../providers/default-style';
import { BackService } from '../../utils/back-service';
import { TreeStyle } from '../../tree/tree-style';
import { VerticalStyle } from '../../providers/vertical-style';

@Component({
  selector: 'page-tree-show',
  styles: ['tree-show.scss'],
  templateUrl: 'tree-show.html'
})
export class TreeShow {
  familyTree: Tree;
  selectNode: TreeNode;
  fab: FabContainer;
  copyNode: TreeNode;
  private copyStr: string;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private backService: BackService,
    private defaultStyle: DefaultStyle,
    private verticalStyle: VerticalStyle,
    public treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    // console.debug('tree show', this.familyTree.title);
    this.copyNode = null;
    this.backService.trackView('TreeShow');
  }

  get treeStyle(): TreeStyle {
    if (this.treeService.style === 0) {
       return this.defaultStyle;
    }
    return this.verticalStyle;
  }

  selectDefault() {
    this.fab.close();
    this.treeService.style = 0;
    // console.debug('treeStyle', this.treeStyle);
    this.ngAfterViewInit();
  }

  isDefaultStyle(): boolean {
    return this.treeService.style === 0;
  }

  selectVertical() {
    this.fab.close();
    this.treeService.style = 1;
    // console.debug('treeStyle', this.treeStyle);
    this.ngAfterViewInit();
  }

  isVerticalStyle(): boolean {
     return this.treeService.style === 1;
  }

  paste() {
    this.fab.close();
    const n = JSON.parse(JSON.stringify(this.copyNode));
    n.nt = NodeType.DEFAULT;
    if (!this.selectNode.children) {
      this.selectNode.children = [];
    }
    this.selectNode.children.push(n);
    this.familyTree.ua = new Date();
    this.treeStyle.show(this.treeService.maleFirst);
    this.backService.trackAction('node', 'paste');
  }
  // 复制节点
  private nodeCopy() {
    this.copyNode = JSON.parse(JSON.stringify(this.selectNode));
    if (this.copyNode.nt !== NodeType.DEFAULT) {
      // 复制伴侣
      if (!this.copyNode.children) {
        this.copyNode.children = [];
      }
      const b = JSON.parse(JSON.stringify(this.treeStyle.selectNode.parent.data));
      delete b.children;
      b.nt = this.copyNode.nt;
      this.copyNode.children.push(b);
      // 如果是配偶则复制配偶的后裔
      for (const c of this.treeStyle.selectNode.parent.data.children) {
        if (c.other === this.copyNode.name) {
          const o = JSON.parse(JSON.stringify(c));
          o.other = b.name;
          this.copyNode.children.push(o);
        }
      }
    }
    this.copyStr = nodeToStr(this.copyNode);
    this.backService.copy(this.copyStr);
  }
  // 复制
  copy() {
    this.fab.close();
    const toast = this.toastCtrl.create({
      message: `${this.selectNode.name}及其后裔已经复制，等待粘贴。`,
      position: 'middle',
      duration: 3000
    });
    toast.present();
    this.nodeCopy();
    this.backService.trackAction('node', 'copy');
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
    .then((tree: Tree) => this.treeStyle.show(this.treeService.maleFirst));
  }
  // 初始化之后
  ngAfterViewInit() {
    // 创建家谱默认式样
    this.treeStyle.init(this.familyTree, '#tree', this.treeService.maleFirst);
    // 绑定点击节点动作
    this.treeStyle.clickNodeListener((node: TreeNode) => {
      this.selectNode = node;
      if (this.fab) {
        this.fab.close();
      }
      this.backService.hold();
    });
    // 显示家谱
    this.treeStyle.show(this.treeService.maleFirst);
    this.treeStyle.toCenter();
    // console.log(nodeToStr(this.selectNode));
  }
  // 设置浮动按钮
  setFab(fab: FabContainer) {
    this.fab = fab;
    this.backService.paste()
    .then((str: string) => {
      if (str && str !== this.copyStr) {
        try {
          this.copyNode = strToNode(str);
          this.copyStr = str;
          this.fab.close();
        } catch (e) {
          console.error(e);
          this.backService.touch();
        }
      } else {
        this.backService.touch();
      }
    });
  }
  // 分享文字
  shareText() {
    this.fab.close();
    SocialSharing.share(
      nodeToStr(this.selectNode),
      this.familyTree.title,
      null
    );
    this.backService.touch();
    this.backService.trackAction('node', 'shareText');
  }
  // 分享截图
  shareImage() {
    this.fab.close();
    this.treeStyle.toImage()
    .then((img: string) => {
      SocialSharing.share(
        null,
        this.familyTree.title,
        img,
        null
      );
      this.backService.touch();
      this.backService.trackAction('node', 'shareImage');
    });
  }
  // 显示删除按钮
  showRemove(): boolean {
    return this.treeStyle && this.treeStyle.isDeleted();
  }
  // 编辑节点
  editNode() {
    this.fab.close();
    this.treeService.editNode(this.selectNode, this.familyTree)
    .then((node) => this.treeStyle.show(this.treeService.maleFirst));
    this.backService.touch();
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
    this.treeStyle.show(this.treeService.maleFirst);
    this.backService.trackAction('node', 'addConsort');
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
    this.treeStyle.show(this.treeService.maleFirst);
    this.backService.trackAction('node', 'addChildren');
  }
  // 删除节点
  removeNode() {
    this.fab.close();
    console.debug('删除节点:', this.selectNode.name);
    this.nodeCopy();
    this.treeStyle.removeNode();
    this.backService.trackAction('node', 'removeNode');
    this.backService.touch();
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
    this.treeStyle.show(this.treeService.maleFirst);
    this.backService.trackAction('node', 'addParent');
  }
}
