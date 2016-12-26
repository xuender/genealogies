import { NodeType } from './node-type';
import { Unknown } from './unknown';
import { TreeNode } from './tree-node';

describe('Unknown', () => {
    const node: TreeNode = {
        name: 'xxx父亲',
        gender: true,
        nt: NodeType.DEFAULT
    };
    describe('new Unknown', () => {
        const u = new Unknown(node);
        it('not null', () => expect(u).not.toBeNull());
        it('no unknow', () => expect(u.unknown.length).toBe(0));
    });
    describe('check', () => {
        it('checkName', () => {
            const u = new Unknown(node);
            u.checkName();
            expect(u.unknown.length).toBe(1);
        });
        it('checkDob', () => {
            const u = new Unknown(node);
            u.checkDob();
            expect(u.unknown.length).toBe(1);
        });
        it('checkDod', () => {
            node.dead = true;
            const u = new Unknown(node);
            u.checkDod();
            expect(u.unknown.length).toBe(1);
        });
        it('checkConsort', () => {
            node.children = [{name: '孩子', gender: true, nt: NodeType.DEFAULT}];
            const u = new Unknown(node);
            u.checkConsort();
            expect(u.unknown.length).toBe(1);
        });
    });
});
