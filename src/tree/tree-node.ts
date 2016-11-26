import { NodeType } from './node-type';
/**
 * 节点
 */
export interface TreeNode {
  id?: string;        // 共享时才需要ID
  name: string;       // 姓名
  gender: boolean;  // 性别
  dob: string;  // 出生日期
  nt: NodeType;  // 节点类型 0:默认, 1:配偶 2:前任
  children?: TreeNode[];  // 孩子们
  dobn?: string;   // 生日提醒ID
  dead?: boolean;  // 死亡
  other?: string;  // 父亲或母亲的名字

  ca?: Date;      // 创建时间
  ua?: Date;      // 修改时间
}
