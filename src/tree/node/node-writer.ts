import { filter } from 'underscore';

import { NodeType } from '../node-type';
import { TreeNode } from '../tree-node';
import { count } from '../../utils/array';

export class NodeWriter {
	private texts: string[];

	constructor(private node: TreeNode) {
		this.texts = [];
	}

	write(): string {
		this.nodeText(this.node, void 0, 1);
		this.texts.push('--复制粘贴到《老豆家谱》可以生成方便编辑查看的树形家谱');
		return this.texts.join('\n');
	}

	private nodeText(node: TreeNode, p: TreeNode, generation: number) {
		const ts: string[] = [];
		ts.push(`${ generation }代`);
		ts.push(node.dead ? `[${node.name}]` : node.name);

		// 2-5
		ts.push(this.extData(node, p, generation));
		ts.push(this.consortData(node));
		ts.push(this.boyData(node));
		ts.push(this.girlData(node));
		if (generation === 1 || (ts[2] && ts[2].length > 3) || ts[3] || ts[4] || ts[5]) {
			this.texts.push(ts.join(''));
		}

		for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT)) {
			this.nodeText(c, node, generation + 1);
		}
	}

	private extData(node: TreeNode, p: TreeNode, generation?: number): string {
		const ks: string[] = [];
		let b = false;
		if ((node.nt === NodeType.DEFAULT && !node.gender) || (p && node.nt > NodeType.DEFAULT && node.gender === p.gender)) {
			ks.push(`${node.gender ? '男' : '女'}`);
			b = true;
		}
		if (node.dob || (node.dead && node.dod)) {
			ks.push(`${node.dob ? node.dob.substr(0, 10) : '?'}~${node.dead ? (node.dod ? node.dod.substr(0, 10) : '?') : ''}`);
			b = true;
		}
		if (node.phone) {
			ks.push(`电话:${node.phone}`);
			b = true;
		}
		if (node.nt === NodeType.EX) {
			ks.push('离异');
			b = true;
		}

		// 父节点有多个伴侣时声明父亲或母亲
		if (node.other && p && count(p.children, (n: TreeNode) => n.nt > NodeType.DEFAULT) > 1) {
			ks.push(`${p.gender ? '母' : '父'}:${node.other}`);
			b = true;
		}
		if (b) {
			return `(${ks.join(' ')})`;
		}
		return '';
	}

	private consortData(node: TreeNode): string {
		const q: string[] = [];
		for (const c of filter(node.children, (f: any) => f.nt > NodeType.DEFAULT)) {
			const oq: string[] = [];
			oq.push(c.dead ? `[${c.name}]` : c.name);
			oq.push(this.extData(c, node));
			q.push(oq.join(''));
		}
		if (q.length > 0) {
			return `. ${ node.gender ? '娶妻' : '嫁予' }${ q.join(', ') }`;
		}
		return '';
	}

	private boyData(node: TreeNode): string {
		const ns: string[] = [];
		for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && f.gender)) {
			ns.push(c.dead ? `[${c.name}]` : c.name);
		}
		if (ns.length > 0) {
			return `. 生子${ns.length}: ${ ns.join(', ') }`;
		}
		return '';
	}

	private girlData(node: TreeNode): string {
		const ns: string[] = [];
		for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && !f.gender)) {
			ns.push(c.dead ? `[${c.name}]` : c.name);
		}
		if (ns.length > 0) {
			return `. 生女${ns.length}: ${ ns.join(', ') }`;
		}
		return '';
	}
}
