import { TreeNode } from '../tree-node';
import { NodeType } from '../node-type';
import { NodeWriter } from './node-writer';

describe('TreeWriter', () => {
	const root: TreeNode = {
		name: 'root',
		gender: true,
		phone: '123321',
		nt: NodeType.DEFAULT,
		children: [
			{
				name: 'w',
				gender: false,
				nt: NodeType.CONSORT
			},
			{
				name: 'a',
				gender: true,
				nt: NodeType.DEFAULT,
				children: [
					{
						name: 'c',
						gender: false,
						nt: NodeType.DEFAULT,
					}
				]
			},
			{
				name: 'b',
				gender: true,
				nt: NodeType.DEFAULT,
				children: [
					{
						name: 'w1',
						gender: false,
						nt: NodeType.CONSORT
					},
					{
						name: 'w2',
						gender: false,
						nt: NodeType.EX
					},
					{
						name: 'c',
						gender: true,
						dob: '2002',
						other: 'w2',
						nt: NodeType.DEFAULT,
					}
				]
			}
		]
	};
	describe('node to string', () => {
		const nw = new NodeWriter(root);
		const str = nw.write();
		// console.debug(str);
		const lines = str.split('\n');
		it('strings fooder', () => expect(lines[lines.length - 1].indexOf('--')).toBe(0));
		it('lines length', () => expect(lines.length).toBe(5));
		it('phone', () => expect(lines[0].indexOf('123321')).toBeGreaterThanOrEqual(0));
	});
});
