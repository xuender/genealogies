import { TreeNode } from './tree-node';
/**
 * 家谱
 */
export interface Tree {
  id: string;     // 主键
  title: string;  // 家谱标题
  note: string;   // 说明
  root: TreeNode;     // 根节点
  aliveNum?:  number;   // 活着的人数
  totalNum?:  number;   // 总人数

  ca?: Date;      // 创建时间
  ua?: Date;      // 修改时间
}
