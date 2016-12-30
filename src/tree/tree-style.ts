import { TreeNode } from './tree-node';
import { Tree } from './tree';
// 家谱式样接口
export interface TreeStyle {
  name(): string;
  init(tree: Tree, svgId: string, maleFirst: boolean): void;
  selectNode: any;
  show(maleFirst: boolean): void;
  sort(node: TreeNode): void;
  onClickNode: (node: TreeNode) => void;
  isDeleted(): boolean;
  removeNode(): void;
  isRoot(): boolean;
  toImage(): Promise<String>;
  toCenter(): void;
}
