import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { TreeList } from '../pages/tree-list/tree-list';
import { Setting } from '../pages/setting/setting';
import { UnknownTree } from '../pages/unknown-tree/unknown-tree';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = Home;
  // rootPage: any = Setting;
  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform) {
    this.initializeApp();
    // 左侧导航菜单页面
    this.pages = [
      { title: '我的家', component: Home },
      { title: '家谱', component: TreeList },
      { title: '问题列表', component: UnknownTree},
      { title: '设置', component: Setting }
    ];

  }

  initializeApp() {
    this.platform.setLang('zh', true);
    // console.debug(this.platform.lang());
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
