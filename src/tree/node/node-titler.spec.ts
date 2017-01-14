import { TreeNode } from '../tree-node';
import { NodeType } from '../node-type';
import { NodeTitler } from './node-titler';
import { TITLE_DEFAULT } from './title';

describe('NodeTitler', () => {
	const c: TreeNode = {
		name: 'c',
		gender: true,
		nt: NodeType.DEFAULT,
	};
	const p: TreeNode = {
		name: 'p',
		gender: true,
		nt: NodeType.DEFAULT,
		children: [c]
	};
	describe('children', () => {
		const titler = new NodeTitler(TITLE_DEFAULT, p);
		titler.selectNode = p;
		it('son', () => expect(titler.title(c)).toBe('儿子'));
	});
	describe('father', () => {
		const titler = new NodeTitler(TITLE_DEFAULT, p);
		titler.selectNode = c;
		it('father', () => expect(titler.title(p)).toBe('父亲'));
	});
});
