import { Component } from '@angular/core';
import { SocialSharing } from 'ionic-native';
import { AlertController, ToastController, NavController, NavParams, ViewController, FabContainer, ModalController } from 'ionic-angular';

import { Tree } from '../../tree/tree';
import { NodeType } from '../../tree/node-type';
import { TreeStyle } from '../../tree/tree-style';
import { TreeService } from '../../tree/tree-service';
import { BackService } from '../../utils/back-service';
import { NodeMerge } from '../../tree/node/node-merge';
import { DefaultStyle } from '../../providers/default-style';
import { VerticalStyle } from '../../providers/vertical-style';
import { TreeNode, nodeToStr, strToNode } from '../../tree/tree-node';

@Component({
	selector: 'page-tree-show',
	styles: ['tree-show.scss'],
	templateUrl: 'tree-show.html'
})
export class TreeShow {
	familyTree: Tree;
	selectNode: TreeNode;
	fab: FabContainer;
	history: string[];
	private copyStr: string;

	constructor(
		public params: NavParams,
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		private modalCtrl: ModalController,
		private toastCtrl: ToastController,
		private alertController: AlertController,
		private backService: BackService,
		private defaultStyle: DefaultStyle,
		private verticalStyle: VerticalStyle,
		public treeService: TreeService
	) {
		this.history = [];
		this.familyTree = this.params.get('tree');
		this.backService.trackView('TreeShow');
	}

	info() {
		const s = JSON.stringify(this.familyTree);
		this.treeService.edit(this.familyTree)
		.then((tree: Tree) => {
			if (tree) {
				this.treeStyle.show();
				this.addHistory(s);
			}
		});
	}

	private addHistory(s = JSON.stringify(this.familyTree)) {
		this.history.push(s);
	}

	undo() {
		this.alertController.create({
			title: '确认撤消操作',
			subTitle: `是否确认执行撤消操作，退回到之间的记录？`,
			buttons: [
				{
					text: '取消',
					role: 'cancel'
				},
				{
					text: '确认',
					handler: () => {
						const s = this.history.pop();
						if (s) {
							for (let i = 0; i < this.treeService.trees.length; i++) {
								if (this.treeService.trees[i] === this.familyTree) {
									this.familyTree = JSON.parse(s);
									this.familyTree.ua = new Date();
									this.treeService.trees[i] = this.familyTree;
									this.ngAfterViewInit();
									this.backService.trackAction('tree', 'undo');
									return;
								}
							}
						}
					}
				}
			]
		}).present();
	}

	editNode() {
		this.fab.close();
		this.treeService.editNode(this.selectNode, this.familyTree)
		.then((node) => {
			if (node) {
				this.addHistory();
				Object.assign(this.selectNode, node);
				this.familyTree.ua = new Date();
				this.treeStyle.show();
			}
		});
		this.backService.touch();
	}

	addParent() {
		this.addHistory();
		const root = {
			name: `${this.selectNode.name}父亲`,
			gender: true,
			nt: NodeType.DEFAULT,
			children: [this.familyTree.root],
		};
		this.familyTree.root = root;
		this.familyTree.ua = new Date();
		this.treeStyle.show();
		this.backService.trackAction('node', 'addParent');
	}

	addConsort() {
		this.addHistory();
		if (!this.selectNode.children) {
			this.selectNode.children = [];
		}
		this.selectNode.children.push({
			name: `${this.selectNode.name}${this.selectNode.gender ? '妻子' : '丈夫'}`,
			gender: !this.selectNode.gender,
			nt: NodeType.CONSORT,
		});
		this.familyTree.ua = new Date();
		this.treeStyle.show();
		this.backService.trackAction('node', 'addConsort');
	}

	addChildren() {
		this.addHistory();
		if (!this.selectNode.children) {
			this.selectNode.children = [];
		}
		this.selectNode.children.push({
			name: `${this.selectNode.name}儿子`,
			gender: true,
			nt: NodeType.DEFAULT,
		});
		this.familyTree.ua = new Date();
		this.treeStyle.show();
		this.backService.trackAction('node', 'addChildren');
	}

	paste() {
		this.fab.close();
		this.addHistory();
		new NodeMerge(this.selectNode).merge(this.treeService.copyNode);
		this.familyTree.ua = new Date();
		this.treeStyle.show();
		this.backService.trackAction('node', 'paste');
	}

	copy() {
		this.fab.close();
		const toast = this.toastCtrl.create({
			message: `${this.selectNode.name}及其后裔已经复制，可粘贴到《老豆家谱》或微信、QQ、邮件中分享。`,
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
		this.addHistory();
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
			if (img) {
				SocialSharing.share(
					null,
					this.familyTree.title,
					img,
					null
				);
				this.backService.touch();
				this.backService.trackAction('node', 'shareImage');
			}
		});
	}

	shareLink() {
		this.fab.close();
		// TODO 尚未实现
	}

	get treeStyle(): TreeStyle {
		if (this.treeService.isDefaultStyle()) {
			return this.defaultStyle;
		}
		return this.verticalStyle;
	}

	/*
	   selectDefault() {
	   this.fab.close();
	   this.treeService.style = 0;
	   this.ngAfterViewInit();
	   }

	   selectVertical() {
	   this.fab.close();
	   this.treeService.style = 1;
	   this.ngAfterViewInit();
	   }
	 */

	changeSameSurname() {
		this.changeBoolean('sameSurname');
	}

	private changeBoolean(key: string) {
		this.fab.close();
		this.treeService[key] = !this.treeService[key];
		this.treeStyle.show();
		this.backService.trackAction('tree', key);
	}

	changeNoWoman() {
		this.changeBoolean('noWoman');
	}

	changeMaleFirst() {
		this.changeBoolean('maleFirst');
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
		this.treeStyle.init(this.familyTree, '#tree');
		// 绑定点击节点动作
		this.treeStyle.onClickNode = (node: TreeNode) => {
			this.selectNode = node;
			if (this.fab) {
				this.fab.close();
			}
			this.backService.hold();
		};
		// 显示家谱
		this.treeStyle.show();
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
		return this.treeStyle && this.treeStyle.canDeleted();
	}
}
