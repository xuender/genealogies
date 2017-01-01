import { find, filter } from 'underscore';

import { NodeType } from '../node-type';
import { count, remove } from '../../utils/array';
import { TreeNode , nodeEach } from '../tree-node';

export class NodeReader {
    private lines: string[];
    private root: TreeNode;
    private nodes: TreeNode[][] = [];
    private nowNum: number = 1;

    constructor(str: string) {
        this.lines = str.split('\n');
        const last = this.lines[this.lines.length - 1];
        remove(this.lines, (s: string) => !s || s.indexOf('--') === 0);
        if (this.lines.length < 1) {
            throw 'lines length error';
        }
        if (last.indexOf('--') !== 0) {
            throw 'The last line begins with --';
        }
        if (last.indexOf('微家谱') < 0) {
            throw 'not my app';
        }
    }

    parse(): TreeNode {
        for (const l of this.lines) {
            const node = this.strToNode(l);
            if (!this.root) {
                this.root = node;
            }
        }
        // 只有一个伴侣时，所有子女都是该伴侣的子女
        nodeEach(this.root, (n: TreeNode) => {
            if (n.children && n.children.length > 1) {
                if (count(n.children, (w: TreeNode) => w.nt > NodeType.DEFAULT) === 1) {
                    const other = find(n.children, (w: TreeNode) => w.nt > NodeType.DEFAULT);
                    if (other) {
                        for (const c of filter(n.children, (w: TreeNode) => w.nt === NodeType.DEFAULT)){
                            c.other = other.name;
                        }
                    }
                }
            }
        });
        return this.root;
    }

    private static STOP_REG = new RegExp('\\.\\s*'); // 句号分割
    private static COMMA_REG = new RegExp(',\\s*'); // 逗号分割
    private static NUM_REG = new RegExp('^([1-9]+[\\d]*)代([\\s\\S]+)'); // 代数及其他正则表达式
    private static MAW_REG = new RegExp('娶妻|嫁予'); // 夫妻

    private strToNode(l: string): TreeNode {
        let tmp: TreeNode = {
            name: '',
            gender: true,
            nt: NodeType.DEFAULT,
        };
        const parentsAndChildren: string[] = l.split(NodeReader.STOP_REG);
        const numAndName = NodeReader.NUM_REG.exec(parentsAndChildren[0]);

        const num: number = parseInt(numAndName[1], 10);
        tmp = this.decodeExt(numAndName[2], tmp);
        let node: TreeNode = void 0;
        if (this.root) {    // 非根节点
            if (this.nodes[num]) {
                node = find(this.nodes[num], (n: TreeNode) => n.name === tmp.name && n.gender === tmp.gender);
                if (node) {
                    Object.assign(node, tmp);
                    remove(this.nodes[num], (n: TreeNode) => n === node);
                }
            }
        }
        if (!node) {
            node = tmp;
        }

        for (let i = 1; i < parentsAndChildren.length; i++) {
            if (NodeReader.MAW_REG.test(parentsAndChildren[i])) {
                this.decodeManAndWife(parentsAndChildren[i].replace(NodeReader.MAW_REG, ''), node);
            } else {
                this.decodeChildren(parentsAndChildren[i], node, num + 1);
            }
        }

        // 清除后裔记录
        if (num < this.nowNum) {
            for (let i = num + 1; i < this.nodes.length; i++) {
                this.nodes[i] = [];
            }
        }
        this.nowNum = num;
        return node;
    }

    private static DIE_REG = new RegExp('^\\[([\\s\\S]+)\\]([\\s\\S]*)');   // 死亡
    private static LIVE_REG = new RegExp('^([^\\(]+)([\\s\\S]*)');   // 活着
    private static EXT_REG = new RegExp('^\\(([男女]*)*\\s*([?~\\d]*)*\\s*(电话:[#\\-\\d]*)*\\s*([父母:]+[\\s\\S]+)*\\s*([离异]*)\\)$'); // 扩展数据

    private decodeExt(str: string, node: TreeNode): TreeNode {
        if (!str) {
            return node;
        }
        // console.debug('dext', str);
        let extStr = '';
        if (NodeReader.DIE_REG.test(str)) {
            node.dead = true;
            const dr = NodeReader.DIE_REG.exec(str);
            node.name = dr[1];
            extStr = dr[2];
        } else {
            const lr = NodeReader.LIVE_REG.exec(str);
            node.name = lr[1];
            extStr = lr[2];
            // console.debug('lr', lr);
        }
        // console.debug('extStr', extStr);
        if (extStr) {
            const er = NodeReader.EXT_REG.exec(extStr);
            if (er) {
                // console.log('er', er);
                if (er[1]) {
                    node.gender = er[1] === '男';
                }
                if (er[2]) {
                    const bs = er[2].split('~');
                    if (bs[0] && bs[0].length > 3) {
                        node.dob = bs[0];
                    }
                    if (bs[1] && bs[1].length > 3) {
                        node.dod = bs[1];
                    }
                }
                if (er[3]) {
                    node.phone = er[3].split(':')[1];
                }
                if (er[4]) {
                    node.other = er[4].substring(2);
                }
                if (er[5]) {
                    node.nt = NodeType.EX;
                }
            }
        }
        return node;
    }

    private decodeChildren(str: string, node: TreeNode, generation: number) {
        if (!str) {
            return;
        }
        const g = str.indexOf('子') === 1;
        // console.debug('decodeZn', str, g);
        for (const s of str.substr(5).split(NodeReader.COMMA_REG)) {
            let zn: TreeNode = {
                name: '',
                gender: g,
                dead: false,
                nt: NodeType.DEFAULT,
            };
            zn = this.decodeExt(s, zn);
            if (node.children) {
                node.children.push(zn);
            } else {
                node.children = [zn];
            }
            if (this.nodes[generation]) {
                this.nodes[generation].push(zn);
            } else {
                this.nodes[generation] = [zn];
            }
        }
    }

    private decodeManAndWife(str: string, node: TreeNode) {
        if (str) {
            // console.debug('decodeFq', str);
            for (const s of str.split(NodeReader.COMMA_REG)) {
                // console.debug('fq', s);
                let fq: TreeNode = {
                    name: '',
                    gender: !node.gender,
                    dead: false,
                    nt: NodeType.CONSORT,
                };
                fq = this.decodeExt(s, fq);
                if (node.children) {
                    node.children.push(fq);
                } else {
                    node.children = [fq];
                }
            }
        }
    }
}
