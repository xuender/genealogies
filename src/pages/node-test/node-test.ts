import { Component } from '@angular/core';
import { NodeReader } from '../../tree/node/node-reader';
import { TreeService } from '../../tree/tree-service';

@Component({
	selector: 'page-node-test',
	templateUrl: 'node-test.html'
})
export class NodeTest {
	msg: string;
	constructor(
		public treeService: TreeService
	) {
	}

	read() {
		const root = new NodeReader(this.msg).read();
		console.log(root);
		this.treeService.trees[0].root = root;
	}
}
