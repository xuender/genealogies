import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
// import { Ng2Webstorage } from 'ng2-webstorage';

import { TreeService } from '../tree/tree-service';

import { Home } from '../pages/home/home';
import { NodeModal } from '../pages/node-modal/node-modal';
import { Setting } from '../pages/setting/setting';
import { TreeList } from '../pages/tree-list/tree-list';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { TreeShow } from '../pages/tree-show/tree-show';
import { UnknownTree } from '../pages/unknown-tree/unknown-tree';
import { UnknownList } from '../pages/unknown-list/unknown-list';


@NgModule({
  declarations: [
    MyApp,
    Home,
    NodeModal,
    Setting,
    TreeList,
    TreeModal,
    UnknownTree,
    UnknownList,
    TreeShow
  ],
  imports: [
    IonicModule.forRoot(MyApp)
    // Ng2Webstorage.forRoot({ prefix: 'family', separator: '.'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    NodeModal,
    Setting,
    TreeList,
    TreeModal,
    UnknownTree,
    UnknownList,
    TreeShow
  ],
  providers: [
    TreeService
  ]
})
export class AppModule {}
