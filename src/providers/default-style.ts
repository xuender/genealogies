import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { event, select } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { tree, hierarchy } from 'd3-hierarchy';
import { Tree } from '../tree/tree';
import { NodeType } from '../tree/node-type';
import { TreeNode } from '../tree/tree-node';
import { TreeStyle } from '../tree/tree-style';
import { filter, find, remove } from '../utils/array';
import { enc } from 'crypto-js';


@Injectable()
export class DefaultStyle implements TreeStyle {
  // 家谱
  private familyTree: Tree;
  // 选择的节点
  selectNode: any;
  // 绘图区域
  private svg: any;
  // 工作区
  private work: any;
  private background: any;
  // 男丁在前
  private maleFirst: boolean;
  // 单击节点事件
  private onClickNode: (node: TreeNode) => void;
  // 家谱尺寸
  private width: number;
  private height: number;
  private maxWidth: number;
  private zoom: any;

  protected nodeWidth: number;
  protected nodeHeight: number;
  protected writingMode: string;
  protected isFillet: boolean;
  protected nodeSize: [number, number];
  constructor(
    public platform: Platform
  ) {
    this.nodeWidth = 80;
    this.nodeHeight = 40;
    this.writingMode = 'horizontal-tb';
    this.isFillet = true;
    this.nodeSize = [120, 120];
  }
  public init(familyTree: Tree, svgId: string, maleFirst: boolean) {
    this.selectNode = {};
    this.familyTree = familyTree;
    this.maleFirst = maleFirst;
    this.svg = select(svgId);
    this.svg.selectAll('*').remove();
    this.background = this.svg.append('g');
    this.work = this.svg.append('g').attr('transform', 'translate(10, 10)');
    this.zoom = zoom()
    .scaleExtent([1 / 4, 2])
    .on('zoom', () => this.work.attr('transform', event.transform));
    this.svg.call(this.zoom);
  }
  toCenter() {
    this.zoom.translateBy(this.svg, this.maxWidth * -1 + this.platform.width() / 2, 0);
  }
  name(): string {
     return '默认式样';
  }
  // 转换成图片
  public toImage(): Promise<String> {
    return new Promise((resolve, reject) => {
      const html = this.work.html();
      const svg = `<svg width="${this.width}px" height="${this.height}px" version="1.1" xmlns="http://www.w3.org/2000/svg">${html}</svg>`;
      const words = enc.Utf8.parse(svg);
      const data = enc.Base64.stringify(words);
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
      context.fillStyle = '#FFF';
      context.fillRect(0, 0, this.width, this.height);
      const image = new Image();
      image.src = `data:image/svg+xml;base64,${data}`;
      image.onload = () => {
        context.drawImage(image, 0, 0);
        // console.debug(canvas.toDataURL('image/png'));
        resolve(canvas.toDataURL('image/png'));
      };
    });
  }
  // 是否选择根节点
  isRoot() {
    return this.selectNode && !this.selectNode.parent;
  }

  removeNode() {
    // console.debug('removeNode');
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
    console.debug('name', this.name(), this.nodeWidth);
    this.width = 333;
    this.height = 133;
    this.maleFirst = maleFirst;
    // 排序
    this.sort(this.familyTree.root);
    // 删除伴侣
    this.rc(this.familyTree.root);
    // 树形数据
    const root = hierarchy(this.familyTree.root);
    // console.debug(JSON.stringify(this.familyTree.root));
    // 计算节点宽度
    const nodes = root.descendants();
    // 树形图形
    const treeData = tree()
    .nodeSize(this.nodeSize)
    .separation((a: any, b: any) => {
      // 根据伴侣数量决定夫妻宽度
      let l = 0;
      if (a.data.bak) {
        l += a.data.bak.length;
      }
      if (b.data.bak) {
        l += b.data.bak.length;
      }
      return l * 0.5 + 1;
    });
    treeData(root);
    // 夫妻居中
    for (const n of filter(nodes, (a: any) => a.data.bak && a.data.bak.length > 0)) {
      n.x -= n.data.bak.length * (this.nodeSize[0] - 20) / 2;
    }
    // console.log('root', root);
    // 增加伴侣
    const nl = nodes.length;
    for (let i = 0; i < nl; i++) {
      const n: any = <any> nodes[i];
      if (n.data.bak && n.data.bak.length > 0) {
        // console.log('bak', n.data.bak);
        n.data.bak.forEach((c, f) => {
          const b: any = <any> hierarchy(c).descendants()[0];
          b.x = n.x + f * (this.nodeSize[0] - 20) + this.nodeSize[0] - 20;
          b.y = n.y;
          // TODO 伴侣的位置
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
    this.background.select('text').remove();
    // 家谱标题
    this.background.append('text')
    .attr('font-size', '36px')
    .attr('x', 20).attr('y', 50)
    .text(this.familyTree.title);
    // 设置夫妻关系
    // for (const n of nodes){
    //   if (n.data.nt !== NodeType.DEFAULT) {
    //     n.y -= 80;  // 夫妻关系位置上移
    //   }
    // }
    // 计算家谱宽高
    let minW = 0;
    let minH = 0;
    for (const n of <any[]> nodes) {
      if (n.x < minW) {
        minW = n.x;
      }
      if (n.y < minH) {
        minH = n.y;
      }
      if (n.x > this.width) {
        this.width = n.x;
      }
      if (n.y > this.height) {
        this.height = n.y;
      }
    }
    this.width -= minW;
    this.width += 100;
    this.height -= minH;
    this.height += 130;
    // 居中
    this.maxWidth = 0;
    for (const n of <any[]> nodes) {
      if (n.x < this.maxWidth) {
        this.maxWidth = n.x;
      }
    }
    this.maxWidth = this.maxWidth * -1 + 50;
    // 家谱位置
    const g = this.work.append('g')
    .attr('class', 'part')
    .attr('transform', (d: Node) => `translate(${this.maxWidth}, ${80})`);
    // 线条
    const links = root.links();
    for (const n of nodes) {
      if (n.data.other) {
        for (const c of n.parent.children) {
          if (c.data.name === n.data.other) {
            links.unshift({
              source: c,
              target: n
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
      if (d.source.data.name === d.target.data.other) {
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
      if (this.selectNode !== d) {
        this.onClickNode(d.data);
        this.selectNode = d;
        this.updateNode(g, nodes);
      }
    })
    .attr('transform', d => `translate(${d.x},${d.y})`);
    const selectRect = node.filter((d: any) => d === this.selectNode)
    .append('rect')
    .attr('width', this.nodeWidth + 10).attr('height', this.nodeHeight + 10)
    .attr('x', (this.nodeWidth + 10) / -2).attr('y', (this.nodeHeight + 10) / -2)
    .attr('fill', 'gold');
    if (this.isFillet) {
      selectRect.attr('rx', 25).attr('ry', 25);
    }
    // 方框
    const rect = node.append('rect')
    .attr('width', this.nodeWidth).attr('height', this.nodeHeight)
    .attr('x', this.nodeWidth / -2).attr('y', this.nodeHeight / -2)
    .attr('fill', (d) => d.data.gender ? '#dff' : '#fdf')  // 颜色
    .attr('stroke', (d) => d.data.dead ? 'black' : '#aaa')  // 边框
    .attr('stroke-width', 2);
    if (this.isFillet) {
      rect.attr('rx', 20).attr('ry', 20);
    }
    // 文字
    node.append('text')
    .attr('text-anchor', 'middle')
    .attr('pointer-event', 'auto')
    .attr('dx', 0).attr('dy', 3)
    .attr('font-size', '14')
    .attr('writing-mode', this.writingMode)
    .attr('style', 'letter-spacing: -1pt')
    .text((d) => d.data.name.substr(0, 5));
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
