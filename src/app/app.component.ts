import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { TreeList } from '../pages/tree-list/tree-list';
import { Setting } from '../pages/setting/setting';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = Home;
  pages: Array<{title: string, component: any}>;
  constructor(public platform: Platform) {
    this.initializeApp();
    // 左侧导航菜单页面
    this.pages = [
      { title: '我的家', component: Home },
      { title: '家谱', component: TreeList },
      { title: '设置', component: Setting }
    ];

  }

  initializeApp() {
    this.platform.setLang('zh', true);
    // console.debug(this.platform.lang());
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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
