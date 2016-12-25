import { NodeType } from './node-type';
import { TreeNode, nodeToStr , strToNode } from './tree-node';

describe('TreeNode', () => {
    const root: TreeNode = {
        name: 'root',
        gender: true,
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
                        gender: true,
                        dob: '2012',
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
                        name: 'c',
                        gender: true,
                        dob: '2002',
                        nt: NodeType.DEFAULT,
                    }
                ]
            }
        ]
    };
    describe('nodeToStr', () => {
        const str = nodeToStr(root);
        // console.info(str);
        const lines = str.split('\n');
        it('lines length', () => expect(lines.length).toBe(6));
        it('fooder', () => expect(lines[lines.length - 1].indexOf('--')).toBe(0));
        it('parent in line', () => expect(lines[4].indexOf('b') > 0).toBe(true));
    });
    describe('strToNode', () => {
        const str = `1代root. 娶妻w. 生子2: a, b
2代a. 生子1: c
3代c(2012~)
2代b. 生子1: c
3代c(2002~ 父:b)
--复制粘贴到《微家谱》可以生成方便编辑查看的树形家谱`;
        // const node: TreeNode = strToNode(str);
        // it('not null', () => expect(node).not.toBeNull());
        // it('root', () => expect(node.name).toBe('root'));
    });
});
