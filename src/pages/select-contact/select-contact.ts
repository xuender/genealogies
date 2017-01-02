import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewController, NavParams } from 'ionic-angular';
import { Contact } from 'ionic-native';

import { TreeNode } from '../../tree/tree-node';
import { BackService } from '../../utils/back-service';
import { ContactsService } from '../../providers/contacts-service';

@Component({
    selector: 'page-select-contact',
    templateUrl: 'select-contact.html'
})
export class SelectContact {
    node: TreeNode;
    contacts: Contact[];
    select: number;
    constructor(
        public domSanitizer: DomSanitizer,
        public viewCtrl: ViewController,
        private backService: BackService,
        private contactsService: ContactsService,
        public params: NavParams
    ) {
        this.node = this.params.get('node');
        this.contacts = [];
        this.select = -1;
        this.backService.trackView('SelectContact');
    }

    ionViewDidLoad() {
        const name = this.node.name;
        this.contactsService.filter(name)
        .then((contacts) => {
            this.contacts.push.apply(this.contacts, contacts);
            this.backService.trackAction('contacts', 'ok');
        }, () => {
            this.backService.trackAction('contacts', 'error');
        });
    }

    ok() {
        this.viewCtrl.dismiss(this.contacts[this.select]);
        this.backService.touch();
    }

    cancel() {
        this.viewCtrl.dismiss();
        this.backService.touch();
    }
}
