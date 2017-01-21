import { groupBy } from 'underscore';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Title , TITLE_DEFAULT } from '../../tree/node/title';
import { TitlePage } from '../title/title';

@Component({
	selector: 'page-title-list',
	templateUrl: 'title-list.html'
})
export class TitleListPage {
	titles: [string, Title[]][];

	constructor(private navCtrl: NavController) {
		this.titles = [];
		const g = groupBy(TITLE_DEFAULT, (t) => t.classify);
		for (const c in g) {
			if (c in g) {
				this.titles.push([c, g[c]]);
			}
		}
	}

	open(title: Title) {
		// console.debug('title', title);
		this.navCtrl.push(TitlePage, {
			title: title,
			titles: TITLE_DEFAULT.slice(0, 12)
		});
	}
}
