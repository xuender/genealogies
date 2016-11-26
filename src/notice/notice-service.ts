import { Injectable } from '@angular/core';
import { ToastController  } from 'ionic-angular';
import { Calendar } from 'ionic-native';
import { LocalStorage } from 'ng2-webstorage';

import * as uuid from 'uuid';

import { Notice } from './notice';
import { find, remove } from '../utils/array';
/**
 * 通知
 */
@Injectable()
export class NoticeService {
  @LocalStorage()
  public notices: Notice[];
  constructor(
    public toastCtrl: ToastController
  ) {
    if (!this.notices) {
      this.notices = [];
    }
  }
  // 创建通知
  create(msg: string, nt: Date): Notice {
    const n: Notice = {
      id: uuid(),
      msg: msg,
      nt: nt,
    };
    this.notices.push(n);
    this.notices = this.notices;
    // 创建提醒
    const start = new Date();
    const end = new Date();
    start.setMinutes(start.getMinutes() + 10);
    end.setHours(end.getHours() + 1);
    // Calendar.createEventWithOptions(n.msg, '', n.msg, start, end, {recurrence: 'yearly', recurrenceInterval: 1})
    /*
    Calendar.hasReadPermission()
    .then((ok) => {
      const toast = this.toastCtrl.create({
        message: ok ? '有读权限' : '无读权限',
        position: 'top',
        cssClass: 'text-center',
        duration: 3000
      });
      toast.present();
    });
    */
    Calendar.createEventWithOptions(n.msg, null, n.msg, start, end, {firstReminderMinutes: 5})
    .then(() => {
      const toast = this.toastCtrl.create({
        message: `增加${n.msg}提醒`,
        position: 'top',
        cssClass: 'text-center',
        duration: 3000
      });
      toast.present();
    });
    start.setMinutes(start.getMinutes() - 90);
    end.setHours(end.getHours() + 10);
   Calendar.listEventsInRange(start, end)
   .then((l) => {
     console.log(JSON.stringify(l));
   });
    return n;
  }
  // 删除通知
  remove(id: string) {
    const n = find(this.notices, (o: Notice) => o.id === id);
    remove(this.notices, (o: Notice) => o.id === id);
    this.notices = this.notices;
    if (n) {
      // 删除提醒
      Calendar.deleteEvent(n.msg, null, n.msg, new Date(n.nt), new Date(n.nt))
      .then((d: any) => {
        const toast = this.toastCtrl.create({
          message: d ? '取消成功' : '取消失败',
          position: 'top',
          cssClass: 'text-center',
          duration: 3000
        });
        toast.present();
      });
    }
  }
}
