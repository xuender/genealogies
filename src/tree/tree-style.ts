import { Tree } from './tree';
import { TreeNode } from './tree-node';
// 家谱式样接口
export interface TreeStyle {
  // 选择的节点
  selectNode: any;
  // 显示家谱
  show(maleFirst: boolean): void;
  // 节点排序
  sort(node: TreeNode): void;
  // 点击节点监听
  clickNodeListener(onClickNode: (node: TreeNode) => void): void;
  // 是可以被删除的
  isDeleted(): boolean;
  // 删除选择节点
  removeNode(): void;
  // 是否是根节点
  isRoot(): boolean;
}
// 式样构造器
interface StyleConstructor {
  new (tree: Tree, svgId: string, maleFirst: boolean): TreeStyle;
}

// 创建式样
export function createStyle(ctor: StyleConstructor, tree: Tree, svgId: string, maleFirst: boolean): TreeStyle {
  return new ctor(tree, svgId, maleFirst);
}
