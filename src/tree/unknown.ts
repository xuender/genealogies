import { TreeNode, nodeEach } from './tree-node';
import { NodeType } from './node-type';
import { Tree } from './tree';
import { filter, count } from '../utils/array';
/**
 * 问题列表
 */
export interface Unknown {
  // 节点
  node:   TreeNode;
  // 问题列表
  unknown: string[];
}
function checkName(n: TreeNode, unknowns: string[]) {
  for (const s of ['无名', '妻子', '丈夫', '父亲', '奶奶', '祖母', '儿子', '妈妈', '女儿', '姐姐', '哥哥', '爷爷', '祖父']) {
    if (n.name.indexOf(s) >= 0) {
      unknowns.push('姓名未知');
      return;
    }
  }
}
function checkDob(n: TreeNode, unknowns: string[]) {
  if (n.dob) {
    if (n.children) {
      const dob = new Date(n.dob);
      const olds: string[] = [];
      for (const o of filter(n.children, (c: TreeNode) => c.nt === NodeType.DEFAULT && new Date(c.dob) < dob)){
        olds.push(o.name);
      }
      if (olds.length > 0) {
        unknowns.push(`年龄小于: ${olds.join(', ')}`);
      }
    }
  } else {
    unknowns.push('出生日期未知');
  }
}
function checkDod(n: TreeNode, unknowns: string[]) {
  if (n.dead) {
    if (n.dod) {
      const dod = new Date(n.dod);
      if (n.dob) {
        const dob = new Date(n.dob);
        if (dob > dod) {
          unknowns.push('忌日小于生日');
        }
      }
      if (n.children) {
        const olds: string[] = [];
        for (const o of filter(n.children, (c: TreeNode) => c.nt === NodeType.DEFAULT && new Date(c.dob) > dod)){
          olds.push(o.name);
        }
      if (olds.length > 0) {
        unknowns.push(`忌日早于子女生日: ${olds.join(', ')}`);
      }
      }
    } else {
      unknowns.push('忌日未知');
    }
  }
}
function checkConsort(n: TreeNode, unknowns: string[]) {
  if (n.children) {
    const cn = count(n.children, (c: TreeNode) => c.nt === NodeType.DEFAULT);
    const on = count(n.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
    if (cn > 0 && on === 0) {
       unknowns.push('有子女无伴侣');
    }
  }
}
function checkOther(n: TreeNode, unknowns: string[], tree: Tree) {
  if (!n.other) {
    let p: TreeNode = null;
    nodeEach(tree.root, (o: TreeNode) => {
      if (p === null && o.children) {
        if (count(o.children, (i: TreeNode) => i === n) > 0) {
          p = o;
        }
      }
    });
    if (p) {
      const on = count(p.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
      if (on > 1) {
        unknowns.push(`${p.gender ? '母亲' : '父亲'}未知`);
      }
    }
  }
}
// 家谱问题
export function findUnknowns(tree: Tree): Unknown[] {
  const us: Unknown[] = [];
  tree.unknown = 0;
  nodeEach(tree.root, (n: TreeNode) => {
    const unknowns: string[] = [];
    checkName(n, unknowns);
    checkDob(n, unknowns);
    checkDod(n, unknowns);
    checkConsort(n, unknowns);
    checkOther(n, unknowns, tree);
    // checkOther(n, unknowns);
    if (unknowns.length > 0) {
      n.unknown = unknowns.length;
      tree.unknown += n.unknown;
      us.push({
        node: n,
        unknown: unknowns
      });
    }
  });
  us.sort((a: Unknown, b: Unknown) => a.node.star === b.node.star ? 0 : a.node.star ? -1 : 1);
  return us;
}
