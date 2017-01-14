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

	describe('str read node', () => {
		const node: TreeNode = new NodeReader(str).read();
		it('not null', () => expect(node).not.toBeNull());
		it('root', () => expect(node.name).toBe('root'));
		it('root children length', () => expect(node.children.length).toBe(3));
		it('w', () => expect(node.children[0].name).toBe('w'));
		it('phone', () => expect(node.children[1].phone).toBe('123321'));
		it('c1', () => expect(node.children[1].children[0].name).toBe('c'));
		it('c2', () => expect(node.children[2].children[2].name).toBe('c'));
		const newStr = new NodeWriter(node).write();
		// console.log(newStr);
		it('new str', () => expect(newStr).toBe(str));
	});

	const xu = `
1代[徐a]. 生子2: 徐a1, 徐a2.
2代徐a1. 生子1: 徐a11
3代徐a11. 生子1: 徐a111
2代徐a2(1978-03-21~ 电话:13456789123). 娶妻房氏(1982-02-09~ 电话:13890123458). 生女1: 徐宝宝
3代徐宝宝(女 2008-06-16~)
--复制粘贴到《老豆家谱》可以生成方便编辑查看的树形家谱`;
	describe('lost node', () => {
		const node: TreeNode = new NodeReader(xu).read();
		// console.log('node', JSON.stringify(node));
		it('not null', () => expect(node).not.toBeNull());
		it('children length', () => expect(node.children.length).toBe(2));
		it('dob', () => expect(node.children[1].children[1].dob).toBe('2008-06-16'));
	});
});
