import { filter } from 'underscore';

import { NodeType } from './node-type';
import { NodeWriter } from './node/node-writer';
import { NodeReader } from './node/node-reader';

export interface TreeNode {
	id?: string;        // 共享时才需要ID
	name: string;       // 姓名
	gender: boolean;  // 性别
	nt: NodeType;  // 节点类型 0:默认, 1:配偶 2:前任
	children?: TreeNode[];  // 孩子们，包括妻子
	phone?: string;
	bak?: TreeNode[]; // 备份
	bak2?: TreeNode[]; // 备份2
	p?: TreeNode;   // 父节点，不能保存必须删除
	dob?: string;  // 出生日期
	dead?: boolean;  // 是否死亡
	dod?: string;     // 忌日
	other?: string;  // 父亲或母亲的名字
	unknown?: number; // 未知数量
	star?: boolean;   // 关注
	ignore?: boolean; // 忽略
}

export function nodeToStr(node: TreeNode): string {
	return new NodeWriter(node).write();
}

export function strToNode(str: string): TreeNode {
	return new NodeReader(str).read();
}

export function nodeEach(
	node: TreeNode,
	run: (n: TreeNode, p?: TreeNode, level?: number) => boolean,
		p = void 0,
		level = 1
): boolean {
	if (run(node, p, level)) {
		return true;
	}
	for (const c of filter(node.children, (n: TreeNode) => n.nt > NodeType.DEFAULT)) {
		if (nodeEach(c, run, node, level)) {
			return true;
		}
	}
	for (const c of filter(node.children, (n: TreeNode) => n.nt === NodeType.DEFAULT && n.gender)) {
		if (nodeEach(c, run, node, level + 1)) {
			return true;
		}
	}
	for (const c of filter(node.children, (n: TreeNode) => n.nt === NodeType.DEFAULT && !n.gender)) {
		if (nodeEach(c, run, node, level + 1)) {
			return true;
		}
	}
	return false;
}
