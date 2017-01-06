import { TreeNode } from './tree-node';

export interface Tree {
	id: string;     // 主键
	title: string;  // 家谱标题
	note: string;   // 说明
	root: TreeNode;     // 根节点
	aliveNum?:  number;   // 活着的人数
	totalNum?:  number;   // 总人数
	unknown?: number;     // 未知问题

	ca?: Date;      // 创建时间
	ua?: Date;      // 修改时间
}
