import * as d3 from './d3';
import { Tree } from './tree';
import { NodeType } from './node-type';
import { TreeNode } from './tree-node';
import { TreeStyle } from './tree-style';
import { find, remove } from '../utils/array';
// 默认式样
export class DefaultStyle implements TreeStyle {
  // 家谱
  familyTree: Tree;
  // 选择的节点
  selectNode: any;
  // 绘图区域
  svg: any;
  // 男丁在前
  maleFirst: boolean;
  // 单击节点事件
  onClickNode: (node: TreeNode) => void;
  constructor(tree: Tree, svgId: string, maleFirst: boolean) {
    this.selectNode = {};
    this.familyTree = tree;
    this.maleFirst = maleFirst;
    const svg = d3.select(svgId);
    this.svg = svg.append('g').attr('transform', 'translate(10, 10)');
    svg.call(
      d3.zoom()
      .scaleExtent([1 / 3, 2])
      .on('zoom', () =>  this.svg.attr('transform', d3.event.transform))
    );
  }
  // 是否选择根节点
  isRoot() {
    return !this.selectNode.parent;
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
    // 没有子节点并且不是根节点
    return (!this.selectNode.children && this.selectNode.parent)
    // 根节点并且有1个子节点
      || (!this.selectNode.parent && this.selectNode.children && this.selectNode.children.length === 1);
  }
  // 显示家谱
  show(maleFirst: boolean) {
    this.maleFirst = maleFirst;
    // 排序
    this.sort(this.familyTree.root);
    // 树形数据
    const root = d3.hierarchy(this.familyTree.root);
    // console.debug(JSON.stringify(this.familyTree.root));
    if (this.selectNode.data) {
      this.selectNode = find(root.descendants(), (n: any) => n.data === this.selectNode.data);
    } else {
      this.selectNode = root;
    }
    let maxDepth = 0;  // 叶子节点的最大深度
    // console.debug('root.leaves', root.leaves());
    for (const l of root.leaves()) {
      if (l.depth > maxDepth) {
        maxDepth = l.depth;
      }
    }
    // 计算节点宽度
    const nodes = root.descendants();
    // console.debug('root.descendants', root.descendants());
    for (const n of nodes.reverse()) {
      if (n.children) {
        n.w = 0;
        for (const c of n.children) {
          n.w += c.w;
        }
      } else {
        n.w = 120;
      }
    }
    // 树形图形
    const tree = d3.tree()
    .size([root.w, maxDepth * 150])
    .separation((a, b) => a.parent === b.parent ? 1 : 1.5);  // 父亲不同则拉开距离
    tree(root);
    // 删除所有元素
    this.svg.selectAll('*').remove();
    // 家谱标题
    this.svg.append('text')
    .attr('font-size', '36px')
    .attr('dx', 10).attr('dy', 30)
    .text(this.familyTree.title);
    // 设置夫妻关系
    for (const n of nodes){
      if (n.data.nt !== NodeType.DEFAULT) {
        n.y -= 80;  // 夫妻关系位置上移
      }
    }
    // 家谱位置
    const g = this.svg.append('g')
    .attr('class', 'part')
    .attr('x', 30)
    .attr('y', 30)
    .attr('transform', (d: Node) => `translate(${30}, ${30})`);
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
    this.updateNode(g, root);
  }
  // 点击监听
  clickNodeListener(onClickNode: (node: TreeNode) => void) {
    this.onClickNode = onClickNode;
  }
  // 选择节点后刷新节点
  updateNode(g: any, root: any) {
    g.selectAll('.node').remove();
    // 节点
    const node = g.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('click', (d) => {
      this.onClickNode(d.data);
      this.selectNode = d;
      this.updateNode(g, root);
    })
    .attr('transform', d => `translate(${d.x},${d.y})`);
    // 方框
    node.append('rect')
    .attr('width', 80).attr('height', 40)
    .attr('x', -40).attr('y', 0)
    .attr('rx', 20).attr('ry', 20)
    .attr('fill', (d) => d === this.selectNode ? '#fdd' : d.data.gender ? '#dff' : '#fdf')  // 颜色
    .attr('stroke', (d) => d.data.dead ? 'black' : '#aaa')  // 边框
    .attr('stroke-width', 2);
    // 文字
    node.append('text')
    .attr('text-anchor', 'middle')
    .attr('pointer-event', 'auto')
    .attr('dx', 0).attr('dy', 23)
    .text((d) => d.data.name);
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
          return new Date(a.dob).getTime() - new Date(b.dob).getTime();
        }
      });
    }
  }
}
