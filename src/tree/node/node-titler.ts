import { find, each, filter } from 'underscore';
import { TreeNode, nodeEach } from '../tree-node';
import { Title } from './title';
import { NodeType } from '../node-type';

export class NodeTitler {
	private cache: [TreeNode, string][];
	private _selectNode: TreeNode;
	private allNodes: TreeNode[];

	constructor(
		private titles: Title[],
		private root: TreeNode
	) {
		this.cache = [];
		this.allNodes = [];
		nodeEach(this.root, (n) => this.allNodes.push(n));
	}

	set selectNode(node: TreeNode) {
		this._selectNode = node;
		this.cache = [];
		this.childrenTitle(node, this.titles[0]);
		this.parentTitle(node, this.titles[0]);
	}

	private childrenTitle(node: TreeNode, title: Title) {
		if (find(this.cache, (n) => n[0] === node)) {
			return;
		}

		this.cache.push([node, title.title]);
		each(filter(node.children, (n) => n.nt === NodeType.EX), (n) => this.cache.push([n, n.gender ? title.exHusband : title.exWife]));
		each(filter(node.children, (n) => n.nt === NodeType.CONSORT), (n) => this.cache.push([n, n.gender ? title.husband : title.wife]));
		each(filter(node.children, (n) => n.nt === NodeType.DEFAULT), (n) => {
			if (n.gender) {
				if (title.son.title) {
					this.setTitle(n, title.son.title);
				} else {
					const ca = find(this.cache, (c) => c[1] === title.son.compare);
					const ct = this.beYoung(ca[0], n) ? title.son.young : title.son.older;
					this.setTitle(n, ct);
				}
			} else {
				if (title.daughter.title) {
					this.setTitle(n, title.daughter.title);
				} else {
					const ca = find(this.cache, (c) => c[1] === title.daughter.compare);
					const ct = this.beYoung(ca[0], n) ? title.daughter.young : title.daughter.older;
					this.setTitle(n, ct);
				}
			}
		});
	}

	private beYoung(c: TreeNode, n: TreeNode): boolean {
		if (c.dob === n.dob) {
			let young = false;
			for (const i of this.allNodes) {
				if (i === c) {
					young = true;
				}
				if (i === n) {
					return young;
				}
			}
		}
		return c.dob < n.dob;
	}

	private setTitle(node: TreeNode, title: string) {
		const s = find(this.titles, (t) => t.title === title);
		if (s) {
			this.childrenTitle(node, s);
		} else {
			this.cache.push([node, title]);
		}
	}

	private parentTitle(node: TreeNode, title: Title) {
		nodeEach(this.root, (n, p) => {
			if (p && n === node) {
				const pt = find(this.titles, (t) => p.gender ? t.title === title.father : t.title === title.mother);
				if (pt) {
					this.childrenTitle(p, pt);
					this.parentTitle(p, pt);
				}
			}
		});
	}

	title(node: TreeNode): string {
		const c = find(this.cache, (i: [TreeNode, string]) => i[0] === node);
		if (c) {
			return c[1];
		}
		return '';
	}
}
