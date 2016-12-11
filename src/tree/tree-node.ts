import { NodeType } from './node-type';
import { find, remove, filter, count } from '../utils/array';
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
// 遍历节点
export function nodeEach(node: TreeNode, run: (n: TreeNode) => void) {
  run(node);
  if (node.children) {
    for (const c of node.children) {
      nodeEach(c, run);
    }
  }
}
// 节点转换文字
export function nodeToStr(node: TreeNode): string {
  const texts: string[] = [];
  nodeText(node, null, texts, 1);
  texts.push('--复制到《家谱》可以生成方便编辑查看的树形家谱。');
  // console.log('node:', strToNode(texts.join('\n')));
  return texts.join('\n');
}
// 生成扩展属性
function ext(node: TreeNode, p: TreeNode, ts: string[], d: number): boolean {
  const ks: string[] = [];
  let b = false;
  if ((node.nt === NodeType.DEFAULT && !node.gender) || (node.nt > NodeType.DEFAULT && node.gender === p.gender)) {
    ks.push(`${node.gender ? '男' : '女'}`);
    b = true;
  }
  if (node.dob || (node.dead && node.dod)) {
    ks.push(`${node.dob ? node.dob.substr(0, 10) : '?'}~${node.dead ? (node.dod ? node.dod.substr(0, 10) : '?') : ''}`);
    b = true;
  }
  if (node.nt === NodeType.EX) {
    ks.push('离异');
    b = true;
  }
  // 父节点有多个伴侣时声明父亲或母亲
  if (node.other && p && count(p.children, (n: TreeNode) => n.nt > NodeType.DEFAULT) > 1) {
    ks.push(`${p.gender ? '母:' : '父:'}${node.other}`);
    b = true;
  }
  if (b) {
    ts.push(`(${ks.join(' ')})`);
  }
  return b;
}
// 节点文字
function nodeText(node: TreeNode, p: TreeNode, texts: string[], d: number) {
  const ts: string[] = [];
  ts.push(`${d}代`);
  ts.push(node.dead ? `[${node.name}]` : node.name);
  // 扩展信息
  const ex = ext(node, p, ts, d);
  if (node.children && node.children.length > 0) {
    const q: string[] = [];
    for (const c of filter(node.children, (f: any) => f.nt > NodeType.DEFAULT)) {
      const oq: string[] = [];
      oq.push(c.dead ? `[${c.name}]` : c.name);
      ext(c, node, oq, d);
      q.push(oq.join(''));
    }
    if (q.length > 0) {
      ts.push(node.gender ? '娶妻' : '嫁予');
      ts.push(q.join(', '));
    }
    const ns: string[] = [];
    for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && f.gender)) {
      ns.push(c.dead ? `[${c.name}]` : c.name);
    }
    if (ns.length > 0) {
      ts.push('. ');
      ts.push(`生子${ns.length}: `);
      ts.push(ns.join(', '));
    }
    const vs: string[] = [];
    for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && !f.gender)) {
      vs.push(c.dead ? `[${c.name}]` : c.name);
    }
    if (vs.length > 0) {
      ts.push('. ');
      ts.push(`生女${vs.length}: `);
      ts.push(vs.join(', '));
    }
  }
  if (ex || d === 1) {
    texts.push(ts.join(''));
  }
  if (node.children && node.children.length > 0) {
    if (!ex && d > 1) {
      texts.push(ts.join(''));
    }
    for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT)) {
      nodeText(c, node, texts, d + 1);
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
// 文字转换节点
export function strToNode(str: string): TreeNode {
  try {
    const lines: string[] = str.split('\n');
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
  } catch (e) {
    return null;
  }
}
