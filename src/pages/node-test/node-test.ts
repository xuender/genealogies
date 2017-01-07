import { Component } from '@angular/core';
import { NodeReader } from '../../tree/node/node-reader';

@Component({
	selector: 'page-node-test',
	templateUrl: 'node-test.html'
})
export class NodeTest {
	msg: string;

	read() {
		console.log(new NodeReader(this.msg).parse());
	}
}
