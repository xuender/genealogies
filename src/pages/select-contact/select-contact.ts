import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewController, NavParams } from 'ionic-angular';
import { Contacts, Contact } from 'ionic-native';

import { TreeNode } from '../../tree/tree-node';
import { BackService } from '../../utils/back-service';

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
        public params: NavParams
    ) {
        this.node = this.params.get('node');
        this.contacts = [];
        this.select = -1;
        this.backService.trackView('SelectContact');
    }

    ionViewDidLoad() {
        Contacts.find(['displayName', 'formatted'], {
            filter: this.node.name,
            multiple: true,
            desiredFields: ['id', 'name', 'displayName', 'photos', 'birthday', 'phoneNumbers'],
            hasPhoneNumber: false
        })
        .then((contacts) => {
            this.contacts.push.apply(this.contacts, contacts);
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
