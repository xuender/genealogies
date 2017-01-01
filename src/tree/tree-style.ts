import { Tree } from './tree';
import { TreeNode } from './tree-node';

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
