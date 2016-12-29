import { TreeNode } from './tree-node';
import { Tree } from './tree';
// 家谱式样接口
export interface TreeStyle {
  name(): string;
  init(tree: Tree, svgId: string, maleFirst: boolean): void;
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
  // 转换图片
  toImage(): Promise<String>;
  // 居中
  toCenter(): void;
}
