import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// import { Home } from '../pages/home/home';
import { TreeList } from '../pages/tree-list/tree-list';
import { Setting } from '../pages/setting/setting';
import { UnknownTree } from '../pages/unknown-tree/unknown-tree';
import { MenuPage } from './menu-page';
// import { NodeTest } from '../pages/node-test/node-test';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any = TreeList;
	// rootPage: any = Setting;
	pages: Array<MenuPage>;
	constructor(
		public platform: Platform,
		private alertController: AlertController
	) {
		this.initializeApp();
		// 左侧导航菜单页面
		this.pages = [
			// { title: '我的家', component: Home },
			{
				title: '家谱',
				active: true,
				icon: 'home',
				component: TreeList
			},
			{
				title: '问题',
				icon: 'help-circle',
				component: UnknownTree
			},
			{
				title: '设置',
				icon: 'construct',
				component: Setting
			},
			/*
			{
				title: '测试',
				icon: 'construct',
				component: NodeTest
			},
			*/
		];

	}

	initializeApp() {
		this.platform.setLang('zh', true);
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			Splashscreen.hide();
			/*
			   if (this.platform.is('android')) {
			   this.platform.registerBackButtonAction(() => {
			   this.alertController.create({
title: '退出应用',
message: '您确定退出家谱应用么？',
buttons: [
{
text: '退出',
handler: () => this.platform.exitApp()
},
{
text: '取消'
}
]
}).present();
}, 100);
}
			 */
		});
	}

	openPage(page: MenuPage) {
		for (const p of this.pages) {
			p.active = false;
		}
		page.active = true;
		this.nav.setRoot(page.component);
	}
}
