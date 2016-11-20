/**
 * 节点
 */
export interface TreeNode {
  id?: string;        // 共享时才需要ID
  name: string;       // 姓名
  children?: TreeNode[];  // 孩子们
  gender: boolean;  // 性别
  dob: string;  // 出生日期
  dead?: boolean;  // 死亡

  ca?: Date;      // 创建时间
  ua?: Date;      // 修改时间
}
