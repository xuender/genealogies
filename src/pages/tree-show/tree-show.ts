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
import { NodeMerge } from '../../tree/node/node-merge';

@Component({
  selector: 'page-tree-show',
  styles: ['tree-show.scss'],
  templateUrl: 'tree-show.html'
})
export class TreeShow {
  familyTree: Tree;
  selectNode: TreeNode;
  fab: FabContainer;
  private copyStr: string;
  history: string[];
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
    this.history = [];
    this.familyTree = this.params.get('tree');
    // console.debug('tree show', this.familyTree.title);
    this.backService.trackView('TreeShow');
  }

  info() {
    const s = JSON.stringify(this.familyTree);
    this.treeService.edit(this.familyTree)
    .then((tree: Tree) => {
      this.treeStyle.show(this.treeService.maleFirst);
      this.addHistory(s);
    });
  }

  private addHistory(s = JSON.stringify(this.familyTree)) {
    this.history.push(s);
  }

  undo() {
    const s = this.history.pop();
    if (s) {
      this.familyTree = JSON.parse(s);
      this.familyTree.ua = new Date();
      this.ngAfterViewInit();
      this.backService.trackAction('tree', 'undo');
    }
  }

  editNode() {
    this.fab.close();
    this.treeService.editNode(this.selectNode, this.familyTree)
    .then((node) => {
      this.addHistory();
      Object.assign(this.selectNode, node);
      this.familyTree.ua = new Date();
      this.treeStyle.show(this.treeService.maleFirst);
    });
    this.backService.touch();
  }

  addParent() {
    this.addHistory();
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

  addConsort() {
    this.addHistory();
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

  addChildren() {
    this.addHistory();
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

  paste() {
    this.fab.close();
    this.addHistory();
    new NodeMerge(this.selectNode).merge(this.treeService.copyNode);
    this.familyTree.ua = new Date();
    this.treeStyle.show(this.treeService.maleFirst);
    this.backService.trackAction('node', 'paste');
  }

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

  private nodeCopy() {
    this.treeService.copyNode = JSON.parse(JSON.stringify(this.selectNode));
    if (this.treeService.copyNode.nt !== NodeType.DEFAULT) {
      // 复制伴侣
      if (!this.treeService.copyNode.children) {
        this.treeService.copyNode.children = [];
      }
      const b = JSON.parse(JSON.stringify(this.treeStyle.selectNode.parent.data));
      delete b.children;
      b.nt = this.treeService.copyNode.nt;
      this.treeService.copyNode.children.push(b);
      // 如果是配偶则复制配偶的后裔
      for (const c of this.treeStyle.selectNode.parent.data.children) {
        if (c.other === this.treeService.copyNode.name) {
          const o = JSON.parse(JSON.stringify(c));
          o.other = b.name;
          this.treeService.copyNode.children.push(o);
        }
      }
    }
    this.copyStr = nodeToStr(this.treeService.copyNode);
    this.backService.copy(this.copyStr);
  }

  removeNode() {
    this.fab.close();
    console.debug('删除节点:', this.selectNode.name);
    this.nodeCopy();
    this.treeStyle.removeNode();
    this.backService.trackAction('node', 'removeNode');
    this.backService.touch();
  }

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

  isRoot() {
    return this.selectNode && this.treeStyle && this.treeStyle.isRoot();
  }

  isDefault() {
    return this.selectNode
    && (!('nt' in this.selectNode) || this.selectNode.nt === NodeType.DEFAULT);
  }
  // 初始化之后
  ngAfterViewInit() {
    // 创建家谱默认式样
    this.treeStyle.init(this.familyTree, '#tree', this.treeService.maleFirst);
    // 绑定点击节点动作
    this.treeStyle.onClickNode = (node: TreeNode) => {
      this.selectNode = node;
      if (this.fab) {
        this.fab.close();
      }
      this.backService.hold();
    };
    // 显示家谱
    this.treeStyle.show(this.treeService.maleFirst);
    this.treeStyle.toCenter();
    // console.log(nodeToStr(this.selectNode));
  }

  setFab(fab: FabContainer) {
    this.fab = fab;
    this.backService.paste()
    .then((str: string) => {
      if (str && str !== this.copyStr) {
        try {
          this.treeService.copyNode = strToNode(str);
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

  showRemove(): boolean {
    return this.treeStyle && this.treeStyle.isDeleted();
  }
}
