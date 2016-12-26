import { TreeNode, nodeEach } from './tree-node';
import { NodeType } from './node-type';
import { Tree } from './tree';
import { filter, count } from '../utils/array';
/**
 * 问题列表
 */
export class Unknown {
  id: number;
  unknown: string[];

  public static findUnknowns(tree: Tree): Unknown[] {
    const us: Unknown[] = [];
    tree.unknown = 0;
    let id = 1;
    nodeEach(tree.root, (n: TreeNode) => {
      const u = new Unknown(n);
      u.id = id;
      id += 1;
      u.checkName();
      u.checkDob();
      u.checkDod();
      u.checkConsort();
      u.checkOther(tree);

      if (u.unknown.length > 0) {
        n.unknown = u.unknown.length;
        tree.unknown += n.unknown;
        us.push(u);
      }
    });
    us.sort((a: Unknown, b: Unknown) => a.node.star === b.node.star ? a.id - b.id : a.node.star ? -1 : 1);
    return us;
  }

  constructor(private node: TreeNode) {
    this.unknown = [];
  }

  checkName() {
    for (const s of ['无名', '妻子', '丈夫', '父亲', '奶奶', '祖母', '儿子', '妈妈', '女儿', '姐姐', '哥哥', '爷爷', '祖父']) {
      if (this.node.name.indexOf(s) >= 0) {
        this.unknown.push('姓名未知');
        return;
      }
    }
  }

  checkDob() {
    if (this.node.dob) {
      if (this.node.children) {
        const dob = new Date(this.node.dob);
        const olds: string[] = [];
        for (const o of filter(this.node.children, (c: TreeNode) => c.nt === NodeType.DEFAULT && new Date(c.dob) < dob)){
          olds.push(o.name);
        }
        if (olds.length > 0) {
          this.unknown.push(`年龄小于: ${olds.join(', ')}`);
        }
      }
    } else {
      this.unknown.push('出生日期未知');
    }
  }

  checkDod() {
    if (this.node.dead) {
      if (this.node.dod) {
        const dod = new Date(this.node.dod);
        if (this.node.dob) {
          const dob = new Date(this.node.dob);
          if (dob > dod) {
            this.unknown.push('忌日小于生日');
          }
        }
        if (this.node.children) {
          const olds: string[] = [];
          for (const o of filter(this.node.children, (c: TreeNode) => c.nt === NodeType.DEFAULT && new Date(c.dob) > dod)){
            olds.push(o.name);
          }
          if (olds.length > 0) {
            this.unknown.push(`忌日早于子女生日: ${olds.join(', ')}`);
          }
        }
      } else {
        this.unknown.push('忌日未知');
      }
    }
  }

  checkConsort() {
    if (this.node.children) {
      const cn = count(this.node.children, (c: TreeNode) => c.nt === NodeType.DEFAULT);
      const on = count(this.node.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
      if (cn > 0 && on === 0) {
        this.unknown.push('有子女无伴侣');
      }
    }
  }

  checkOther(tree: Tree) {
    if (!this.node.other) {
      let p: TreeNode = null;
      nodeEach(tree.root, (o: TreeNode) => {
        if (p === null && o.children) {
          if (count(o.children, (i: TreeNode) => i === this.node) > 0) {
            p = o;
          }
        }
      });
      if (p) {
        const on = count(p.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
        if (on > 1) {
          this.unknown.push(`${p.gender ? '母亲' : '父亲'}未知`);
        }
      }
    }
  }
}
