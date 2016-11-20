import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, FabContainer, ModalController } from 'ionic-angular';
import { LocalStorage } from "ng2-webstorage";

import * as d3 from '../../tree/d3';

import { Tree } from "../../tree/tree";
import { TreeService } from "../../tree/tree-service";
import { find , remove } from "../../utils/array";
import { NodeModal } from "../node-modal/node-modal";
import { TreeNode } from "../../tree/tree-node";
import { NodeType } from "../../tree/node-type";

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
  @LocalStorage()
  public maleFirst: boolean;
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
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
  // 编辑节点
  editNode() {
    this.fat.close();
    console.debug('编辑节点:', this.selectNode.data.name);
    const nm = this.modalCtrl.create(NodeModal, {
      node: Object.assign({}, this.selectNode.data),
      old: this.selectNode.data,
      tree: this.familyTree,
    });
    nm.present();
    nm.onDidDismiss(node => {
      if (node){
        Object.assign(this.selectNode.data, node);
        this.familyTree.ua = new Date();
        this.show();
      }
    });
  }
  addConsort() {
    this.fat.close();
    console.debug('增加伴侣:', this.selectNode.data.name);
    if (!this.selectNode.data.children){
      this.selectNode.data.children = [];
    }
    this.selectNode.data.children.push({
      name: `${this.selectNode.data.name}的${this.selectNode.data.gender?'妻子':'丈夫'}`,
      gender: !this.selectNode.data.gender,
      nt: NodeType.CONSORT,
      dob: new Date().toISOString(),
      ca: new Date(),
      ua: new Date(),
    });
    this.familyTree.ua = new Date();
    this.show();
  }
  addChildren() {
    this.fat.close();
    console.debug('增加子女:', this.selectNode.data.name);
    if (!this.selectNode.data.children){
      this.selectNode.data.children = [];
    }
    this.selectNode.data.children.push({
      name: `${this.selectNode.data.name}的儿子`,
      gender: true,
      nt: NodeType.DEFAULT,
      dob: new Date().toISOString(),
      ca: new Date(),
      ua: new Date(),
    });
    this.familyTree.ua = new Date();
    this.show();
  }
  // 删除节点
  removeNode() {
    this.fat.close();
    console.debug('删除节点:', this.selectNode.data.name);
    const c=remove(this.selectNode.parent.data.children, (n) => n==this.selectNode.data);
    console.debug('remove:', c);
    this.selectNode = {};
    this.familyTree.ua = new Date();
    this.show();
  }
  // 增加父亲
  addParent() {
    this.fat.close();
    console.debug('增加父亲:', this.selectNode.data.name);
    const root = {
      name: `${this.selectNode.data.name}的父亲`,
      gender: true,
      nt: NodeType.DEFAULT,
      dob: new Date().toISOString(),
      children: [this.familyTree.root],
      ca: new Date(),
      ua: new Date(),
    };
    this.familyTree.root = root;
    this.familyTree.ua = new Date();
    this.show();
  }
  sort(node: TreeNode) {
    if (node.children) {
      for (const n of node.children){
        this.sort(n);
      }
      node.children.sort((a: TreeNode, b: TreeNode) => {
        console.debug('maleFirst', this.maleFirst);
        if(a.nt !== b.nt){  // 子女在前，伴侣在后
           return a.nt - b.nt;
        }
        if(this.maleFirst && a.gender !== b.gender) { //男子在前女子在后
          return a.gender ? -1 : 1;
        } else {
          return new Date(a.dob).getTime() - new Date(b.dob).getTime();
        }
      });
    }
  }
  // 显示家谱
  show() {
    // 排序
    this.sort(this.familyTree.root);
    // 树形数据
    const root = d3.hierarchy(this.familyTree.root);
    // console.debug(JSON.stringify(this.familyTree.root));
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
    for (const n of nodes){
      if(n.data.nt !== NodeType.DEFAULT){
        n.y -= 60;  // 夫妻关系位置上移
      }
    }
    // 家谱位置
    const g = this.svg.append("g")
    .attr("class", "part")
    .attr("x", 30)
    .attr("y", 30)
    .attr("transform", (d: Node) => `translate(${30}, ${30})`);
    // 线条
    const links = root.links();
    for(const n of nodes){
      if(n.data.other) {
        for(const c of n.parent.children){
          if(c.data.name == n.data.other){
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
    .attr("class", "link")
    .attr('fill', 'none')
    .attr('stroke', (d) => {
      console.debug('nt', d.target.data.nt);
      switch(d.target.data.nt){
        case NodeType.CONSORT:
          return 'red';
        case NodeType.EX:
          return 'gray';
      }
      if(d.other){
         return 'lightgreen';
      }
      return 'blue';
    }) // 颜色
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
    .attr('fill', (d) => d == this.selectNode ? '#fdd' : d.data.gender ? '#dff' : '#fdf')  // 颜色
    .attr('stroke', (d) => d.data.deda ? 'black' :'#aaa')  // 边框
    .attr('stroke-width', 2);
    // 文字
    node.append('text')
    .attr('text-anchor', 'middle')
    .attr('pointer-event', 'auto')
    .attr('dx', 0).attr('dy', 23)
    .text((d) => d.data.name);
  }
}
