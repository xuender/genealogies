import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { TreeList } from '../pages/tree-list/tree-list';
import { Setting } from '../pages/setting/setting';
import { TreeService } from "../tree/tree-service";
import { TreeModal } from "../pages/tree-modal/tree-modal";
import { TreeShow } from "../pages/tree-show/tree-show";
import { NodeModal } from "../pages/node-modal/node-modal";

@NgModule({
  declarations: [
    MyApp,
    Home,
    TreeList,
    TreeModal,
    TreeShow,
    NodeModal,
    Setting
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    TreeList,
    TreeModal,
    TreeShow,
    NodeModal,
    Setting
  ],
  providers: [
     TreeService
  ]
})
export class AppModule {}
