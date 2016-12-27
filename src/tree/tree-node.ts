import { NodeType } from './node-type';
import { NodeWriter } from './node/node-writer';
import { NodeReader } from './node/node-reader';
import { filter } from '../utils/array';
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
  unknown?: number; // 未知数量
  star?: boolean;   // 关注
  ignore?: boolean; // 忽略
}

export function nodeToStr(node: TreeNode): string {
  return new NodeWriter(node).toString();
}

export function strToNode(str: string): TreeNode {
  return new NodeReader(str).parse();
}

export function nodeEach(node: TreeNode, run: (n: TreeNode, level?: number) => void, level = 1) {
  run(node, level);
  if (node.children) {
    for (const c of filter(node.children, (n: TreeNode) => n.nt > NodeType.DEFAULT)) {
      nodeEach(c, run, level);
    }
    for (const c of filter(node.children, (n: TreeNode) => n.nt === NodeType.DEFAULT && n.gender)) {
      nodeEach(c, run, level + 1);
    }
    for (const c of filter(node.children, (n: TreeNode) => n.nt === NodeType.DEFAULT && !n.gender)) {
      nodeEach(c, run, level + 1);
    }
  }
}
