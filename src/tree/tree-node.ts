/**
 * 节点
 */
export interface TreeNode {
  id?: string;        // 共享时才需要ID
  name: string;       // 姓名
  children?: TreeNode[];  // 孩子们
}
