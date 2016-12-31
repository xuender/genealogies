import { TreeNode } from './tree-node';
import { Tree } from './tree';
// 家谱式样接口
export interface TreeStyle {
  name: string;
  init(tree: Tree, svgId: string): void;
  selectNode: any;
  show(): void;
  onClickNode: (node: TreeNode) => void;
  canDeleted(): boolean;
  removeNode(): void;
  isRoot(): boolean;
  toImage(): Promise<String>;
  toCenter(): void;
}
