import { NodeType } from './node-type';
/**
 * 节点
 */
export interface TreeNode {
  id?: string;        // 共享时才需要ID
  name: string;       // 姓名
  gender: boolean;  // 性别
  nt: NodeType;  // 节点类型 0:默认, 1:配偶 2:前任
  children?: TreeNode[];  // 孩子们
  bak?: TreeNode[]; // 备份
  dob?: string;  // 出生日期
  dead?: boolean;  // 死亡
  dod?: string;     // 忌日
  other?: string;  // 父亲或母亲的名字
}
