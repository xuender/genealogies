import * as moment from 'moment';
import { filter } from 'underscore';
import { Component } from '@angular/core';
import { Calendar, CallNumber } from 'ionic-native';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { TreeNode } from '../../tree/tree-node';
import { NodeType } from '../../tree/node-type';
import { BackService } from '../../utils/back-service';
import { SelectContact } from '../select-contact/select-contact';
import { ContactsService } from '../../providers/contacts-service';

@Component({
  selector: 'page-node-modal',
  templateUrl: 'node-modal.html'
})
export class NodeModal {
  node: TreeNode;
  others: string[];
  otherTitle: string;
  title: string;
  noClose: boolean;
  parentNode: TreeNode;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public contactsService: ContactsService,
    private backService: BackService
  ) {
    this.node = this.params.get('node');
    this.title = this.params.get('title');
    this.noClose = this.params.get('noClose');
    this.others = [];
    if (this.node.nt === NodeType.DEFAULT) { // 子女才需要设置父母
      const tree = this.params.get('tree');
      if (tree) {
        const old = this.params.get('old');
        this.setParent(tree.root, old);
        if (this.parentNode) {
          this.otherTitle = this.parentNode.gender ? '母亲' : '父亲';
          for (const c of filter(this.parentNode.children, (c) => c.nt > NodeType.DEFAULT)) {
            this.others.push(c.name);
          }
        }
      }
    }
    this.backService.trackView('NodeModal');
  }

  createDob() {
    this.createCalendar(new Date(this.node.dob), `${this.node.name}生日`);
  }

  createDod() {
    this.createCalendar(new Date(this.node.dod), `${this.node.name}忌日`);
  }

  createCalendar(time: Date, title: string) {
    const now = new Date();
    const start = new Date(now.getTime());
    start.setMonth(time.getMonth());
    start.setDate(time.getDate());
    if (start < now) {  // 已经过去，下年提醒
      start.setMonth(start.getMonth() + 12);
    }
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    const end = new Date(start.getTime());
    end.setHours(0);
    end.setMinutes(0);
    end.setSeconds(0);
    const note = title + ' 《微家谱》';
    Calendar.createEventInteractivelyWithOptions(
      title, null, note, start, end, {firstReminderMinutes: 60 * 15, recurrence: 'yearly', recurrenceInterval: 1}
    );
  }

  setParent(root: TreeNode, node: TreeNode) {
    if (root.children) {
      for (const c of root.children) {
        if (c === node) {
          this.parentNode = root;
          return;
        }
        this.setParent(c, node);
      }
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
    this.backService.touch();
  }

  ok() {
    this.viewCtrl.dismiss(this.node);
    this.backService.touch();
  }

  readContact() {
    const sm = this.modalCtrl.create(SelectContact, {
      node: this.node
    });
    sm.onDidDismiss( (contact) => {
      if (contact) {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          this.node.phone = contact.phoneNumbers[0].value;
        }
        if (contact.birthday) {
          this.node.dob = moment(contact.birthday).format('YYYY-MM-DD');
        }
        this.backService.trackAction('node', 'contactOk');
      }
    });
    sm.present();
    this.backService.trackAction('node', 'contact');
  }

  call() {
    CallNumber.callNumber(this.node.phone, true)
    .then(() => this.backService.trackAction('node', 'callOk'));
    this.backService.trackAction('node', 'call');
  }

  star() {
    this.node.star = !this.node.star;
    this.backService.trackAction('node', 'star');
    this.backService.hold();
  }

  ignore() {
    this.node.ignore = !this.node.ignore;
    this.backService.trackAction('node', 'ignore');
    this.backService.hold();
  }

  havePhone(): boolean {
    if (this.node.dead) {
      return false;
    }
    if (this.node.dob) {
      if (moment().years() - moment(this.node.dob).years() < 18) {
        return false;
      }
    }
    return true;
  }
}
