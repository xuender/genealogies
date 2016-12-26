import { NodeType } from './node-type';
import { TreeNode, nodeToStr } from './tree-node';

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
    });
});
