import { NodeType } from './node-type';
import { find, remove, filter, count } from '../utils/array';
import { NodeWriter } from './node/node-writer';
/**
 * 节点
 */
export interface TreeNode {
  id?: string;        // 共享时才需要ID
  name: string;       // 姓名
  gender: boolean;  // 性别
  nt: NodeType;  // 节点类型 0:默认, 1:配偶 2:前任
  children?: TreeNode[];  // 孩子们
  bak?: TreeNode[]; // 备份
  dob?: string;  // 出生日期
  dead?: boolean;  // 死亡
  dod?: string;     // 忌日
  other?: string;  // 父亲或母亲的名字
  unknown?: number; // 未知数量
  star?: boolean;   // 关注
}

// 逗号分割
const D_REG = /,\s*/;
// 句号分割
const J_REG = /\.\s*/;

export function nodeToStr(node: TreeNode): string {
  return new NodeWriter(node).toString();
}

// 文字转换节点
export function strToNode(str: string): TreeNode {
  const lines: string[] = str.split('\n');
  if (lines.length < 2) {
    throw 'line num error';
  }
  if (lines[lines.length - 1].indexOf('微家谱') < 0) {
    throw '应用校验错误';
  }
  remove(lines, (s: string) => !s || s.indexOf('--') === 0);
  // 代数及其他正则表达式
  const cReg = /^([1-9]+[\d]*)代([\s\S]+)/;
  // 返回节点
  let ret: TreeNode = null;
  // 代数节点关系
  const nodes: TreeNode[][] = [];
  // 遍历每一行
  for (const l of lines) {
    let node: TreeNode = null;
    if (ret === null) { // 创建根节点
      node = {
        name: '',
        gender: true,
        nt: NodeType.DEFAULT,
      };
      ret = node;
    }
    // 子女数组
    const zn: string[] = l.split(J_REG);
    // 夫妻数组
    const fq: string[] = zn[0].split(/娶妻|嫁予/);
    // 姓名处理
    let name = fq[0];
    const cr = cReg.exec(name);
    name = cr[2];
    // console.log('name', name);
    const tmp: TreeNode = {
      name: '',
      gender: true,
      nt: NodeType.DEFAULT,
    };
    // 解码姓名
    decodeExt(name, tmp);
    // 代数
    const num: number = parseInt(cr[1], 10);
    if (node === null) {
      for (const pn of nodes[num - 1]) {
        if (pn.children) {
          // TODO 这里需要考虑处理重名
          node = find(pn.children, (n: TreeNode) => n.name === tmp.name && n.gender === tmp.gender);
          if (node) {
            break;
          }
        }
      }
    }
    Object.assign(node, tmp);
    if (nodes[num]) {
      nodes[num].push(node);
    } else {
      nodes[num] = [node];
    }
    // 解码夫妻关系
    decodeFq(fq[1], node);
    // 解码子女关系
    if (zn.length > 1) {
      if (zn[1]) {
        decodeZn(zn[1], node);
      }
      if (zn[2]) {
        decodeZn(zn[2], node);
      }
    }
    // console.log('name', name, node);
  }
  // 只有一个伴侣时
  nodeEach(ret, (n: TreeNode) => {
    if (n.children && n.children.length > 1) {
      if (count(n.children, (w: TreeNode) => w.nt > NodeType.DEFAULT) === 1) {
        const other = find(n.children, (w: TreeNode) => w.nt > NodeType.DEFAULT);
        for (const c of filter(n.children, (w: TreeNode) => w.nt === NodeType.DEFAULT)){
          c.other = other.name;
        }
      }
    }
  });
  // console.debug('nodes', nodes);
  // console.log(lines);
  return ret;
}

// 遍历节点
export function nodeEach(node: TreeNode, run: (n: TreeNode) => void) {
  run(node);
  if (node.children) {
    for (const c of node.children) {
      nodeEach(c, run);
    }
  }
}
// 对扩展数据解码
function decodeExt(str: string, node: TreeNode) {
  // console.debug('dext', str);
  const dReg = /^\[([\s\S]+)\]([\s\S]*)/;
  const lReg = /^([^\(]+)([\s\S]*)/;
  const eReg = /^\(([男女]*)\s*([?~\-\d]*)\s*([父母:]+[\s\S]+)*\s*([离异]*)\)$/;
  let extStr = '';
  if (dReg.test(str)) {
    node.dead = true;
    const dr = dReg.exec(str);
    node.name = dr[1];
    extStr = dr[2];
  } else {
    const lr = lReg.exec(str);
    node.name = lr[1];
    extStr = lr[2];
  }
  if (extStr) {
    const er = eReg.exec(extStr);
    // console.debug('er', er);
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
      node.other = er[3].substring(2);
    }
    if (er[4]) {
      node.nt = NodeType.EX;
    }
  }
}
function decodeZn(str: string, node: TreeNode) {
  const g = str.indexOf('子') === 1;
  // console.debug('decodeZn', str, g);
  for (const s of str.substr(5).split(D_REG)) {
    const zn: TreeNode = {
      name: '',
      gender: g,
      dead: false,
      nt: NodeType.DEFAULT,
    };
    decodeExt(s, zn);
    if (node.children) {
      node.children.push(zn);
    } else {
      node.children = [zn];
    }
  }
}
function decodeFq(str: string, node: TreeNode) {
  if (str) {
    // console.debug('decodeFq', str);
    for (const s of str.split(D_REG)) {
      // console.debug('fq', s);
      const fq: TreeNode = {
        name: '',
        gender: !node.gender,
        dead: false,
        nt: NodeType.CONSORT,
      };
      decodeExt(s, fq);
      if (node.children) {
        node.children.push(fq);
      } else {
        node.children = [fq];
      }
    }
  }
}
