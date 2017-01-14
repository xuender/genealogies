import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Title , TITLE_DEFAULT } from '../../tree/node/title';
import { TitlePage } from '../title/title';

@Component({
	selector: 'page-title-list',
	templateUrl: 'title-list.html'
})
export class TitleListPage {
	titles: Title[];

	constructor(private navCtrl: NavController) {
		this.titles = TITLE_DEFAULT;
	}

	open(title: Title) {
		// console.debug('title', title);
		this.navCtrl.push(TitlePage, {
			title: title,
			titles: this.titles.slice(0, 4)
		});
	}
}
