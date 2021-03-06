import { v4 } from 'uuid';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { Tree } from './tree';
import { NodeType } from './node-type';
import { remove } from '../utils/array';
import { TreeNode , nodeEach } from './tree-node';
import { BackService } from '../utils/back-service';
import { StorageService } from '../utils/storage-service';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { NodeModal } from '../pages/node-modal/node-modal';

@Injectable()
export class TreeService {
	private _maleFirst: boolean;
	private _noWoman: boolean;
	private _sameSurname: boolean;
	private _trees: Tree[];
	private _mySelf: TreeNode;
	private _style: number;
	private _title: boolean;

	copyNode: TreeNode;
	private loadTime: Date;

	set maleFirst(v: boolean) {
		this._maleFirst = v;
		this.storageService.setItem('maleFirst', v);
		this.backService.touch();
	}
	get maleFirst(): boolean {
		return this._maleFirst;
	}

	set title(v: boolean) {
		this._title = v;
		this.storageService.setItem('title', v);
		this.backService.touch();
	}
	get title(): boolean {
		return this._title;
	}

	get style(): number {
		return this._style;
	}
	set style(v: number) {
		this._style = v;
		this.storageService.setItem('style', v);
		this.backService.touch();
	}
	isDefaultStyle(): boolean {
		return this._style === 0;
	}
	isVerticalStyle(): boolean {
		return this._style === 1;
	}

	get noWoman(): boolean {
		return this._noWoman;
	}
	set noWoman(v: boolean) {
		this._noWoman = v;
		this.storageService.setItem('noWoman', v);
		this.backService.touch();
	}

	get sameSurname(): boolean {
		return this._sameSurname;
	}
	set sameSurname(v: boolean) {
		this._sameSurname = v;
		this.storageService.setItem('sameSurname', v);
		this.backService.touch();
	}

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
				return false;
			});
		}
		this._trees = trees;
		this.storageService.setItem('_trees', trees);
	}

	public get mySelf(): TreeNode {
		return this._mySelf;
	}
	public set mySelf(v: TreeNode) {
		this._mySelf = JSON.parse(JSON.stringify(v));
		delete this._mySelf.children;
		this.storageService.setItem('myself', this._mySelf);
	}

	constructor(
		private http: Http,
		private modalCtrl: ModalController,
		private backService: BackService,
		private storageService: StorageService
	) {
		this._style = this.storageService.getItem('style', 1);
		this._maleFirst = this.storageService.getItem('maleFirst', true);
		this._title = this.storageService.getItem('title', false);
		this._noWoman = this.storageService.getItem('noWoman', false);
		this._sameSurname = this.storageService.getItem('sameSurname', false);
		this._mySelf = this.storageService.getItem('myself', void 0);

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
			if (!this.trees || this.trees.length === 0) {
				this.trees = [this.getNewTree()];
			}
		});
		nm.present();
	}

	getNewTree() {
		const root = JSON.parse(JSON.stringify(this.mySelf));
		return {
			id: v4(),
			title: `${this.mySelf.name === '无名氏' ? '无名' : this.mySelf.name[0]}氏家谱`,
			note: '',
			root: root,
			ca: new Date(),
			ua: new Date(),
		};
	}

	add() {
		this.edit(this.getNewTree());
		this.backService.trackAction('tree', 'add');
	}

	edit(tree: Tree): Promise<Tree> {
		return new Promise((resolve, reject) => {
			const treeModal = this.modalCtrl.create(TreeModal, {tree: Object.assign({}, tree)});
			treeModal.onDidDismiss(data => {
				if (data) {
					if (this.isNew(data)) {
						this.trees.push(data);
						resolve(data);
					} else {
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

	editNode(node: TreeNode, tree: Tree): Promise<TreeNode> {
		return new Promise<TreeNode>((resolve, reject) => {
			const nm = this.modalCtrl.create(NodeModal, {
				node: Object.assign({}, node),
				old: node,
				tree: tree
			});
			nm.present();
			nm.onDidDismiss(newNode => resolve(newNode));
		});
	}

	del(tree: Tree) {
		remove(this.trees, (t: Tree) => tree.id === t.id);
		this.trees = this._trees;
		this.backService.trackAction('tree', 'del');
	}
}
