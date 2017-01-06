import { TreeNode } from '../tree-node';
import { NodeReader } from './node-reader';
import { NodeWriter } from './node-writer';

describe('TreeReader', () => {
	const str = `1代root. 娶妻w. 生子2: a, b
2代a(电话:123321). 生女1: c
2代b. 娶妻w1, w2(离异). 生子1: c
3代c(2002~ 母:w2)
--复制粘贴到《老豆家谱》可以生成方便编辑查看的树形家谱`;

	describe('check string', () => {
		it('empty string', () => expect(() => new NodeReader('')).toThrow());
		it('lines length', () => expect(() => new NodeReader('-- 老豆家谱')).toThrow());
		it('no my app', () => expect(() => new NodeReader('张三\n-- 别人家的家谱')).toThrow());
		it('good string', () => expect(() => new NodeReader('张三\n-- 老豆家谱')).not.toThrow());
	});

	describe('str parse node', () => {
		const node: TreeNode = new NodeReader(str).parse();
		it('not null', () => expect(node).not.toBeNull());
		it('root', () => expect(node.name).toBe('root'));
		it('root children length', () => expect(node.children.length).toBe(3));
		it('w', () => expect(node.children[0].name).toBe('w'));
		it('phone', () => expect(node.children[1].phone).toBe('123321'));
		it('c1', () => expect(node.children[1].children[0].name).toBe('c'));
		it('c2', () => expect(node.children[2].children[2].name).toBe('c'));
		const newStr = new NodeWriter(node).toString();
		// console.log(newStr);
		it('new str', () => expect(newStr).toBe(str));
	});
});
