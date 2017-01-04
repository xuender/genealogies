import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { enc } from 'crypto-js';
import { zoom } from 'd3-zoom';
import { find, filter } from 'underscore';
import { event, select } from 'd3-selection';
import { tree, hierarchy, HierarchyNode } from 'd3-hierarchy';

import { Tree } from '../tree/tree';
import { remove } from '../utils/array';
import { NodeType } from '../tree/node-type';
import { TreeStyle } from '../tree/tree-style';
import { TreeService } from '../tree/tree-service';
import { TreeNode , nodeEach } from '../tree/tree-node';

@Injectable()
export class DefaultStyle implements TreeStyle {
  selectNode: any;
  onClickNode: (node: TreeNode) => void;
  name: string;

  private familyTree: Tree;
  private svg: any;
  private work: any;
  private background: any;
  private zoom: any;

  private width: number;
  private height: number;
  private maxWidth: number;

  protected nodeWidth: number;
  protected nodeHeight: number;
  protected writingMode: string;
  protected isFillet: boolean;
  protected nodeSize: [number, number];

  constructor(
    public platform: Platform,
    protected treeService: TreeService
  ) {
    this.name = '现代图';
    this.nodeWidth = 80;
    this.nodeHeight = 40;
    this.writingMode = 'horizontal-tb';
    this.isFillet = true;
    this.nodeSize = [120, 120];
  }

  init(familyTree: Tree, svgId: string) {
    this.selectNode = {};
    this.familyTree = familyTree;
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

  toImage(): Promise<String> {
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
    this.show();
  }

  canDeleted(): boolean {
    if (!this.selectNode) {
      return false;
    }
    // 没有子节点并且不是根节点
    return (!this.selectNode.children && this.selectNode.parent)
    // 根节点并且有1个子节点
      || (!this.selectNode.parent && this.selectNode.children && this.selectNode.children.length === 1);
  }

  show() {
    this.width = 333;
    this.height = 133;

    this.sort(this.familyTree.root);
    const allNodes = this.createAllNodes();
    if (this.treeService.noWoman) {
      this.bakWoman(allNodes);
    }
    if (this.treeService.sameSurname) {
      this.bakOther(allNodes);
    }
    this.bakConsort();

    const root = this.createRoot();
    const nodes = root.descendants();

    if (this.treeService.noWoman || this.treeService.sameSurname) {
      this.restore(allNodes);
    }
    this.restoreConsort(nodes);
    allNodes.forEach((n) => delete n.p);

    if (this.selectNode.data) {
      this.selectNode = find(nodes, (n: any) => n.data === this.selectNode.data);
    } else {
      this.selectNode = root;
    }
    // console.debug('selectNode', this.selectNode);
    this.onClickNode(this.selectNode.data);

    this.svgClean();
    this.svgTitle();

    this.countSize(nodes);

    // 家谱位置
    const g = this.work.append('g')
    .attr('class', 'part')
    .attr('transform', (d: Node) => `translate(${this.maxWidth}, ${80})`);

    this.createLinks(g, nodes, root);
    this.createNodes(g, nodes);
  }

  private sort(node: TreeNode) {
    if (node.children) {
      for (const n of node.children){
        this.sort(n);
      }
      node.children.sort((a: TreeNode, b: TreeNode) => {
        if (a.nt !== b.nt) {  // 子女在前，伴侣在后
          return a.nt - b.nt;
        }
        // 男子在前女子在后
        if (this.treeService.maleFirst && a.gender !== b.gender) {
          return a.gender ? -1 : 1;
        } else {
          return (a.dob ? new Date(a.dob) : new Date()).getTime()
          - (b.dob ? new Date(b.dob) : new Date()).getTime();
        }
      });
    }
  }

  private createAllNodes(): TreeNode[] {
    const ret: TreeNode[] = [];
    nodeEach(this.familyTree.root, (n, p) => {
      n.p = p;
      ret.push(n);
    });
    return ret;
  }

  private bakWoman(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (!node.bak2) {
        node.bak2 = [];
      }
      node.bak2.push.apply(node.bak2, filter(node.children, (c) => !c.gender));
      remove(node.children, (c) => !c.gender);
    }
  }

  private bakOther(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (!node.bak2) {
        node.bak2 = [];
      }
      node.bak2.push.apply(node.bak2, filter(node.children, (c) => c.nt > NodeType.DEFAULT || !c.p.gender));
      remove(node.children, (c) => c.nt > NodeType.DEFAULT || !c.p.gender);
    }
  }

  private bakConsort() {
    nodeEach(this.familyTree.root, (node) => {
        node.bak = filter(node.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
        remove(node.children, (c: TreeNode) => c.nt > NodeType.DEFAULT);
    });
  }

  private createRoot(): HierarchyNode<TreeNode> {
    const root = hierarchy(this.familyTree.root);
    // 树形图形
    tree()
    .nodeSize(this.nodeSize)
    .separation((a: any, b: any) => {
      if (this.treeService.noWoman) {
        return 1;
      } else {
        // 根据伴侣数量决定夫妻宽度
        let l = 0;
        if (a.data.bak) {
          l += a.data.bak.length;
        }
        if (b.data.bak) {
          l += b.data.bak.length;
        }
        return l * 0.5 + 1;
      }
    })(root);
    return root;
  }

  private restore(nodes: TreeNode[]) {
    for (const node of nodes) {
      if (node.bak2 && node.bak2.length > 0) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push.apply(node.children, node.bak2);
        delete node.bak2;
      }
    }
  }

  private restoreConsort(nodes: Array<HierarchyNode<TreeNode>>) {
    for (const n of filter(nodes, (a: any) => a.data.bak && a.data.bak.length > 0)) {
      n.x -= n.data.bak.length * (this.nodeSize[0] - 20) / 2;
    }
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
          // 伴侣的位置
          b.height = n.height;
          nodes.push(b);
          b.parent = n;
          if (!n.children) {
            n.children = [];
          }
          n.children.push(b);
          n.data.children.push(c);
        });
        delete n.data.bak;
      }
    }
  }

  private svgClean() {
    // 删除所有元素
    this.work.selectAll('*').remove();
    this.background.select('text').remove();
  }

  private svgTitle() {
    // 家谱标题
    this.background.append('text')
    .attr('font-size', '36px')
    .attr('x', 20).attr('y', 50)
    .text(this.familyTree.title);
  }

  private countSize(nodes: Array<HierarchyNode<TreeNode>>) {
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
  }

  private createLinks(g: any, nodes: Array<HierarchyNode<TreeNode>>, root: HierarchyNode<TreeNode>) {
    const links = root.links();
    for (const n of nodes) {
      if (n.data.other) {
        for (const c of n.parent.children) {
          if (c.data.name === n.data.other) {
            links.push({
              source: c,
              target: n
            });
          }
        }
      }
    }
    remove(links, (l: any) => l.target.data.nt === NodeType.EX);
    g.selectAll('.link').remove();
    g.selectAll('.link')
    .data(links)
    .enter().append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', (d) => {
      switch (d.target.data.nt) {
        case NodeType.CONSORT:
          return 'red';
      }
      if (d.source.data.name === d.target.data.other) {
        return 'lightgreen';
      }
      return 'blue';
    }) // 颜色
    .attr('stroke-width', (d) => '1.4px') // 宽度 离婚后宽度 0.8px
    .attr('d', (d) => {
      if (d.source.y === d.target.y) {
        return `M${d.source.x},${d.source.y} ${d.target.x},${d.target.y}`;
      } else {
        const p1 = `${ d.source.x },${ d.source.y + this.nodeHeight / 2 }`;
        const p2 = `${ d.source.x },${ (d.source.y + d.target.y) / 2 }`;
        const p3 = `${ d.target.x },${ (d.source.y + d.target.y) / 2 }`;
        const p4 = `${ d.target.x },${ d.target.y - this.nodeHeight / 2 }`;
        return `M${ p1 } C${ p2 } ${ p3 } ${ p4 }`;
      }
    });
  }

  private createNodes(g: any, nodes: Array<HierarchyNode<TreeNode>>) {
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
        this.createNodes(g, nodes);
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
}
