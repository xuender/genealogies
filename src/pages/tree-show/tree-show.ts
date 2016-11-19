import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, FabContainer } from 'ionic-angular';

import * as d3 from '../../tree/d3';

import { Tree } from "../../tree/tree";
import { TreeService } from "../../tree/tree-service";
import { find } from "../../utils/array";

/**
 * 家谱编辑页面
 */
@Component({
  selector: 'page-tree-show',
  styles: ['tree-show.scss'],
  templateUrl: 'tree-show.html'
})
export class TreeShow {
  familyTree: Tree;
  svg: any;
  // 选择的节点
  selectNode: any;
  // 操作按钮
  fat: FabContainer;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private platform: Platform,
    private treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    this.selectNode = {};
    console.debug('tree show', this.familyTree.title);
  }
  // 显示家谱信息
  public info(){
    this.treeService.edit(this.familyTree);
  }
  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('返回');
  }
  ngAfterViewInit(){
    this.svg = d3.select('#tree');
    this.show();
  }
  setFat(fat: FabContainer) {
    this.fat = fat;
  }
  editNode() {
    this.fat.close();
    console.debug('编辑节点:', this.selectNode.data.name);
  }
  addConsort() {
    this.fat.close();
    console.debug('增加伴侣:', this.selectNode.data.name);
  }
  addChildren() {
    this.fat.close();
    console.debug('增加子女:', this.selectNode.data.name);
    if (!this.selectNode.data.children)
      this.selectNode.data.children = [];
    this.selectNode.data.children.push({
      name: '新子女'
    });
    this.show();
  }
  removeNode() {
    this.fat.close();
    console.debug('删除节点:', this.selectNode.data.name);
  }
  // 显示家谱
  show() {
    // 树形数据
    const root = d3.hierarchy(this.familyTree.root);
    if (this.selectNode.data) {
      this.selectNode = find(root.descendants(), (n: any)=> n.data == this.selectNode.data)
    } else {
      this.selectNode = root;
    }
    console.debug('root', root);
    let maxDepth = 0;  // 叶子节点的最大深度
    console.debug('root.leaves', root.leaves());
    for (const l of root.leaves()) {
      if (l.depth > maxDepth) {
        maxDepth = l.depth;
      }
    }
    // 计算节点宽度
    // console.debug('root.descendants', root.descendants());
    for (const n of root.descendants().reverse()) {
      if (n.children) {
        n.w = 0;
        for (const c of n.children) {
          n.w += c.w;
        }
      } else {
        n.w = 120;
      }
    }
    const tree = d3.tree()
    .size([root.w, maxDepth * 150])
    .separation((a, b) => a.parent == b.parent ? 1 : 1.5);  // 父亲不同则拉开距离
    tree(root);
    // 根据tree 计算高度宽度
    this.svg.attr('width', root.w + 60)
    .attr('height', maxDepth * 150 + 80);
    // 删除所有元素
    this.svg.selectAll('*').remove();
    // 家谱标题
    this.svg.append('text')
    .attr('font-size', '36px')
    .attr('dx', 10).attr('dy', 30)
    .text(this.familyTree.title);
    // 设置夫妻关系
    //   nodes = tree.nodes data[0]
    //   for n in nodes # 夫妻关系
    //     n.y += 10
    //     if n.Ctype > 0 then n.y -= 70
    //   links = tree.links nodes
    //   for n in nodes
    //     if 'Other' of n and n.Other > 0
    //       for m in nodes
    //         if m.ID == n.Other
    //           links.unshift(
    //             source: m
    //             target: n
    //             other: true
    //           )
    // 家谱位置
    const g = this.svg.append("g")
    .attr("class", "part")
    .attr("x", 30)
    .attr("y", 30)
    .attr("transform", (d: Node) => `translate(${30}, ${30})`);
    // 线条
    // console.debug('root.links', root.links());
    g.selectAll('.link')
    .data(root.links())
    .enter().append('path')
    .attr("class", "link")
    .attr('fill', 'none')
    .attr('stroke', (d) => 'red') // 颜色 离婚后颜色变化 gray
    .attr('stroke-width', (d) => '1.4px') // 宽度 离婚后宽度 0.8px
    .attr('d', (d, i) => `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`);
    //.attr('d', (d, i) => `M${d.target.x},${d.target.y}V${(d.source.y+10)}H${d.source.x}V${d.source.y}`);
    this.updateNode(g, root);
  }
  updateNode(g: any, root: any){
    g.selectAll('.node').remove();
    // 节点
    const node = g.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .on('click', (d) => {
      if(this.fat) this.fat.close();
      this.selectNode = d;
      this.updateNode(g, root);
    })
    .attr("transform", d => `translate(${d.x},${d.y})`);
    // 方框
    node.append('rect')
    .attr('width', 80).attr('height', 40)
    .attr('x', -40).attr('y', 0)
    .attr('rx', 20).attr('ry', 20)
    .attr('fill', (d) => d == this.selectNode ? '#fdd' : '#dff')  // 颜色 性别不同颜色不公太 #fdf
    .attr('stroke', (d) => '#aaa')  // 边框 在世与否 black
    .attr('stroke-width', 2);
    // 文字
    node.append('text')
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .attr('pointer-event', 'auto')
    .attr('dx', 0).attr('dy', 20)
    .text((d) => d.data.name);
  }
}
