import * as d3 from './d3';
import { Tree } from './tree';
import { NodeType } from './node-type';
import { TreeNode } from './tree-node';
import { TreeStyle } from './tree-style';
import { filter, find, remove } from '../utils/array';
// 默认式样
export class DefaultStyle implements TreeStyle {
  // 家谱
  familyTree: Tree;
  // 选择的节点
  selectNode: any;
  // 绘图区域
  svg: any;
  // 工作区
  work: any;
  // 男丁在前
  maleFirst: boolean;
  // 单击节点事件
  onClickNode: (node: TreeNode) => void;
  constructor(tree: Tree, svgId: string, maleFirst: boolean) {
    this.selectNode = {};
    this.familyTree = tree;
    this.maleFirst = maleFirst;
    this.svg = d3.select(svgId);
    this.work = this.svg.append('g').attr('transform', 'translate(10, 10)');
    this.svg.call(
      d3.zoom()
      .scaleExtent([1 / 4, 2])
      .on('zoom', () =>  this.work.attr('transform', d3.event.transform))
    );
  }
  // 节点文字
  private nodeText(node: TreeNode, texts: string[], d: number) {
    const ts: string[] = [];
    if (d > 1) {
      ts.push(`${d}代${node.gender ? '男' : '女'}`);
    }
    ts.push(node.dead ? `【${node.name}】` : node.name);
    if (node.children && node.children.length > 0) {
      const q: string[] = [];
      for (const c of filter(node.children, (f: any) => f.nt > NodeType.DEFAULT)) {
        q.push(c.dead ? `【${c.name}】` : c.name);
      }
      if (q.length > 0) {
        ts.push(node.gender ? '娶妻' : '嫁予');
        ts.push(q.join('、'));
      }
      const ns: string[] = [];
      for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && f.gender)) {
        ns.push(c.dead ? `【${c.name}】` : c.name);
      }
      if (ns.length > 0) {
        ts.push('，');
        ts.push(`生子${ns.length}人：`);
        ts.push(ns.join('、'));
      }
      const vs: string[] = [];
      for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT && !f.gender)) {
        vs.push(c.dead ? `【${c.name}】` : c.name);
      }
      if (vs.length > 0) {
        ts.push('，');
        ts.push(`生女${vs.length}人：`);
        ts.push(vs.join('、'));
      }
      ts.push('；');
       texts.push(ts.join(''));
      for (const c of filter(node.children, (f: TreeNode) => f.nt === NodeType.DEFAULT)) {
         this.nodeText(c, texts, d + 1);
       }
    }
  }
  // 家谱信息
  getText(): string {
    const texts: string[] = [];
    texts.push(this.familyTree.title);
    this.nodeText(this.familyTree.root, texts, 1);
    return texts.join('\n');
  }
  // 是否选择根节点
  isRoot() {
    return this.selectNode && !this.selectNode.parent;
  }
  // 删除选择节点
  removeNode() {
    if (this.selectNode.parent) {  // 删除子节点
      remove(this.selectNode.parent.data.children, (n) => n === this.selectNode.data);
    } else if (this.selectNode.data.children && this.selectNode.data.children.length === 1) {  // 删除根节点
      this.familyTree.root = this.selectNode.data.children[0];
    }
    this.selectNode = {};
    this.familyTree.ua = new Date();
    this.show(this.maleFirst);
  }
  // 节点是可以被删除的
  isDeleted(): boolean {
    if (!this.selectNode) {
       return false;
    }
    // 没有子节点并且不是根节点
    return (!this.selectNode.children && this.selectNode.parent)
    // 根节点并且有1个子节点
      || (!this.selectNode.parent && this.selectNode.children && this.selectNode.children.length === 1);
  }
  rc(node: TreeNode) {
    if (node.children) {
      node.bak = filter(node.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
      remove(node.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
      for (const c of node.children) {
        if (c.nt === NodeType.DEFAULT) {
          this.rc(c);
        }
      }
    }
  }
  // 显示家谱
  show(maleFirst: boolean) {
    this.maleFirst = maleFirst;
    // 排序
    this.sort(this.familyTree.root);
    // TODO 删除伴侣
    this.rc(this.familyTree.root);
    // 树形数据
    const root = d3.hierarchy(this.familyTree.root);
    // console.debug(JSON.stringify(this.familyTree.root));
    // 计算节点宽度
    const nodes = root.descendants();
    // 树形图形
    const tree = d3.tree()
    .nodeSize([120, 120])
    .separation((a, b) => {
      // 根据伴侣数量决定夫妻宽度
      let l = 0;
      if (a.data.bak) {
        l += a.data.bak.length;
      }
      if (b.data.bak) {
        l += b.data.bak.length;
      }
      return l * 0.5 + 1;
    });  // 父亲不同则拉开距离
    tree(root);
    // 夫妻居中
    for (const n of filter(nodes, (a: any) => a.data.bak && a.data.bak.length > 0)) {
      n.x -= n.data.bak.length * 50;
    }
    // console.log('root', root);
    // 增加伴侣
    const nl = nodes.length;
    for (let i = 0; i < nl; i++) {
      const n = nodes[i];
      if (n.data.bak && n.data.bak.length > 0) {
        // console.log('bak', n.data.bak);
        n.data.bak.forEach((c, f) => {
          const b = d3.hierarchy(c).descendants()[0];
          b.x = n.x + f * 100 + 100;
          b.y = n.y;
          b.height = n.height;
          nodes.push(b);
          b.parent = n;
          if (!n.children) {
            n.children = [];
          }
          n.children.push(b);
          n.data.children.push(c);
          delete n.data.bak;
        });
      }
    }
    // 设置选择节点
    if (this.selectNode.data) {
      this.selectNode = find(nodes, (n: any) => n.data === this.selectNode.data);
    } else {
      this.selectNode = root;
    }
    // console.debug('selectNode', this.selectNode);
    // 点击节点事件
    this.onClickNode(this.selectNode.data);
    // console.debug('nodes', nodes);
    // 删除所有元素
    this.work.selectAll('*').remove();
    this.svg.select('text').remove();
    // 家谱标题
    this.svg.append('text')
    .attr('font-size', '36px')
    .attr('x', 20).attr('y', 50)
    .text(this.familyTree.title);
    // 设置夫妻关系
    // for (const n of nodes){
    //   if (n.data.nt !== NodeType.DEFAULT) {
    //     n.y -= 80;  // 夫妻关系位置上移
    //   }
    // }
    let max = 300;
    for (const n of nodes) {
      if (n.x > max) {
        max = n.x;
      }
    }
    // 家谱位置
    const g = this.work.append('g')
    .attr('class', 'part')
    .attr('transform', (d: Node) => `translate(${max}, ${30})`);
    // 线条
    const links = root.links();
    for (const n of nodes) {
      if (n.data.other) {
        for (const c of n.parent.children) {
          if (c.data.name === n.data.other) {
            links.unshift({
              source: c,
              target: n,
              other: true,
            });
          }
        }
      }
    }
    // 删除无用线条
    remove(links, (l: any) => !('x' in l.source && 'x' in l.target));
    // console.debug('root.links', links);
    g.selectAll('.link')
    .data(links)
    .enter().append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', (d) => {
      switch (d.target.data.nt) {
        case NodeType.CONSORT:
          return 'red';
        case NodeType.EX:
          return 'gray';
      }
      if (d.other) {
        return 'lightgreen';
      }
      return 'blue';
    }) // 颜色
    .attr('stroke-width', (d) => '1.4px') // 宽度 离婚后宽度 0.8px
    .attr('d', (d, i) => `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`);
    this.updateNode(g, nodes);
  }
  // 点击监听
  clickNodeListener(onClickNode: (node: TreeNode) => void) {
    this.onClickNode = onClickNode;
  }
  // 选择节点后刷新节点
  updateNode(g: any, nodes: any) {
    g.selectAll('.node').remove();
    // 节点
    const node = g.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('click', (d) => {
      this.onClickNode(d.data);
      this.selectNode = d;
      this.updateNode(g, nodes);
    })
    .attr('transform', d => `translate(${d.x},${d.y})`);
    node.filter((d: any) => d === this.selectNode)
    .append('rect')
    .attr('width', 90).attr('height', 50)
    .attr('x', -45).attr('y', -25)
    .attr('rx', 20).attr('ry', 20)
    .attr('fill', 'gold');
    // 方框
    node.append('rect')
    .attr('width', 80).attr('height', 40)
    .attr('x', -40).attr('y', -20)
    .attr('rx', 20).attr('ry', 20)
    .attr('fill', (d) => d.data.gender ? '#dff' : '#fdf')  // 颜色
    .attr('stroke', (d) => d.data.dead ? 'black' : '#aaa')  // 边框
    .attr('stroke-width', 2);
    // 文字
    node.append('text')
    .attr('text-anchor', 'middle')
    .attr('pointer-event', 'auto')
    .attr('dx', 0).attr('dy', 3)
    .text((d) => d.data.name.substr(0, 6));
  }
  // 排序
  sort(node: TreeNode) {
    if (node.children) {
      for (const n of node.children){
        this.sort(n);
      }
      node.children.sort((a: TreeNode, b: TreeNode) => {
        if (a.nt !== b.nt) {  // 子女在前，伴侣在后
          return a.nt - b.nt;
        }
        // 男子在前女子在后
        if (this.maleFirst && a.gender !== b.gender) {
          return a.gender ? -1 : 1;
        } else {
          return (a.dob ? new Date(a.dob) : new Date()).getTime()
          - (b.dob ? new Date(b.dob) : new Date()).getTime();
        }
      });
    }
  }
}
