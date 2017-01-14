import { TreeNode } from '../tree-node';
import { NodeType } from '../node-type';
import { NodeMerger } from './node-merger';

describe('TreeMerger', () => {
	describe('children', () => {
		const p: TreeNode = {
			name: 'p',
			gender: true,
			nt: NodeType.DEFAULT,
		};
		const c: TreeNode = {
			name: 'c',
			gender: true,
			nt: NodeType.DEFAULT,
		};
		new NodeMerger(p).merge(c);
		it('children length', () => expect(p.children.length).toBe(1));
		it('children name', () => expect(p.children[0].name).toEqual('c'));
	});

	describe('name equal', () => {
		const p: TreeNode = {
			name: 'p',
			gender: true,
			nt: NodeType.DEFAULT,
		};
		const c: TreeNode = {
			name: 'p',
			gender: false,
			nt: NodeType.DEFAULT,
			children: [
				{
					name: 'bb',
					gender: true,
					nt: NodeType.CONSORT
				}
			]
		};
		new NodeMerger(p).merge(c);
		it('gender', () => expect(p.gender).toEqual(c.gender));
		it('children length', () => expect(p.children.length).toEqual(1));
		it('children name', () => expect(p.children[0].name).toEqual('bb'));
		it('children nt', () => expect(p.children[0].nt).toEqual(NodeType.CONSORT));
	});
});
