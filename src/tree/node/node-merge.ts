import { find, pick, isArray } from 'underscore';

import { TreeNode } from '../tree-node';
import { NodeType } from '../node-type';

export class NodeMerge {
    constructor(private source: TreeNode) {
    }

    merge(node: TreeNode): TreeNode {
        const n = JSON.parse(JSON.stringify(node));
        n.nt = NodeType.DEFAULT;
        if (node.name === this.source.name) {
            NodeMerge.extend(this.source, n);
        } else {
            if (!this.source.children) {
                this.source.children = [];
            }
            this.source.children.push(n);
        }
        return this.source;
    }

    static extend(dst: TreeNode, src: TreeNode) {
        dst.gender = src.gender;
        const t = pick(src, (v, k) => !isArray(v) && k !== 'nt');
        Object.assign(dst, t);
        if (!src.children) {
            return;
        }
        if (!dst.children) {
            dst.children = [];
        }
        for (const c of src.children) {
            const dc = find(dst.children, (i) => i.name === c.name);
            if (dc) {
                NodeMerge.extend(dc, c);
            } else {
                dst.children.push(c);
            }
        }
    }
}
