import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Title } from '../../tree/node/title';

@Component({
	selector: 'page-title',
	templateUrl: 'title.html'
})
export class TitlePage {
	titles: Title[];
	title: Title;
	constructor(
		public navCtrl: NavController,
		public params: NavParams
	) {
		this.title = this.params.get('title');
		this.titles = this.params.get('titles');
	}

	ok() {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TitlePage');
	}
}
