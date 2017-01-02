import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
// import { Ng2Webstorage } from 'ng2-webstorage';

import { BackService } from '../utils/back-service';
import { StorageService } from '../utils/storage-service';
import { TreeService } from '../tree/tree-service';
import { ContactsService } from '../providers/contacts-service';

// import { Home } from '../pages/home/home';
import { NodeModal } from '../pages/node-modal/node-modal';
import { Setting } from '../pages/setting/setting';
import { TreeList } from '../pages/tree-list/tree-list';
import { TreeModal } from '../pages/tree-modal/tree-modal';
import { TreeShow } from '../pages/tree-show/tree-show';
import { UnknownTree } from '../pages/unknown-tree/unknown-tree';
import { UnknownList } from '../pages/unknown-list/unknown-list';
import { DefaultStyle } from '../providers/default-style';
import { VerticalStyle } from '../providers/vertical-style';
import { SelectContact } from '../pages/select-contact/select-contact';


@NgModule({
  declarations: [
    MyApp,
    // Home,
    NodeModal,
    Setting,
    TreeList,
    TreeModal,
    SelectContact,
    UnknownTree,
    UnknownList,
    TreeShow
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '后退',
      // mode: 'ios'
    })
    // Ng2Webstorage.forRoot({ prefix: 'family', separator: '.'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // Home,
    NodeModal,
    SelectContact,
    Setting,
    TreeList,
    TreeModal,
    UnknownTree,
    UnknownList,
    TreeShow
  ],
  providers: [
    StorageService,
    BackService,
    DefaultStyle,
    VerticalStyle,
    ContactsService,
    TreeService
  ]
})
export class AppModule {}
