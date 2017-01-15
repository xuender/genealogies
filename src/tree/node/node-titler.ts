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
		nodeEach(this.root, (n) => {
			this.allNodes.push(n);
			return false;
		});
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
					const ca = this.getCache(title.son.compare);
					if (ca) {
						const ct = this.beYoung(ca[0], n) ? title.son.young : title.son.older;
						this.setTitle(n, ct);
					} else {
						console.warn('比较错误:', title.son.compare);
					}
				}
			} else {
				if (title.daughter.title) {
					this.setTitle(n, title.daughter.title);
				} else {
					const ca = this.getCache(title.daughter.compare);
					if (ca) {
						const ct = this.beYoung(ca[0], n) ? title.daughter.young : title.daughter.older;
						this.setTitle(n, ct);
					} else {
						console.warn('比较错误:', title.daughter.compare);
					}
				}
			}
		});
	}

	private getCache(compare: string | string[]): [TreeNode, string] {
		if (typeof compare === 'string') {
			return find(this.cache, (c) => c[1] === compare);
		}
		for (const c of compare) {
			const ret = this.getCache(c);
			if (ret) {
				return ret;
			}
		}
		return null;
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
		let pt, ptp;
		nodeEach(this.root, (n, p) => {
			if (p && n === node) {
				pt = find(this.titles, (t) => {
					switch (node.nt) {
						case NodeType.DEFAULT:
							return p.gender ? t.title === title.father : t.title === title.mother;
						case NodeType.CONSORT:
							return p.gender ? t.title === title.husband : t.title === title.wife;
						case NodeType.EX:
							return p.gender ? t.title === title.exHusband : t.title === title.exWife;
					}
				});
				ptp = p;
				return true;
			}
			return false;
		});
		if (pt) {
			console.debug('pt', pt);
			this.childrenTitle(ptp, pt);
			this.parentTitle(ptp, pt);
			console.debug('parent end');
		}
	}

	title(node: TreeNode): string {
		const c = find(this.cache, (i: [TreeNode, string]) => i[0] === node);
		if (c) {
			return c[1];
		}
		return '';
	}
}
