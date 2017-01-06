import { Tree } from './tree';
import { TreeNode } from './tree-node';

export interface TreeStyle {
	name: string;
	selectNode: any;

	onClickNode: (node: TreeNode) => void;
	init(tree: Tree, svgId: string): void;
	show(): void;
	canDeleted(): boolean;
	removeNode(): void;
	isRoot(): boolean;
	toImage(): Promise<String>;
	toCenter(): void;
}
