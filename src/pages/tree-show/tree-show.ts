import { Component } from '@angular/core';
import { NavParams, ViewController, Platform } from 'ionic-angular';

import * as d3 from '../../tree/d3';

import { Tree } from "../../tree/tree";
import { TreeService } from "../../tree/tree-service";

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
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private platform: Platform,
    private treeService: TreeService
  ) {
    this.familyTree = this.params.get('tree');
    console.debug('tree show', this.familyTree.title);
  }
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
  show() {
    // TODO 根据tree 计算高度宽度
    // svg
    const height = 300;
    this.svg.attr('width', this.platform.width())
    .attr('height', height);
    // 树形数据
    const root = d3.hierarchy(this.familyTree.root);
    const tree = d3.tree().size([300, 200]);
    tree(root);
    console.debug('root',  root);
    // 家谱位置
    const g = this.svg.append("g")
    .attr("class", "part")
    .attr("x", 30)
    .attr("y", 30)
    .attr("transform", (d: Node) => `translate(${30}, ${30})`);
    // 线条
    const link = g.selectAll('.link')
    .data(root.links());
    link.enter().append('path')
    .attr("class", "link")
    .attr('d', (d, i) => `M${d.target.x},${d.target.y}V${(d.source.y+10)}H${d.source.x}V${d.source.y}`)
    .attr('stroke-dasharray',500)
    .attr('stroke-dashoffset',-500)
    // .transition(t)
    .attr('stroke-dashoffset',0);
    // TODO 矩形
    const node = g.selectAll('.node')
    .data(root.descendants());
    node.attr('class', 'node')
    .attr("transform", d => `translate(${d.x},${d.y})`);
    node.enter().append("g").attr("class", "node ");
  }
}
