import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewController, NavParams } from 'ionic-angular';
import { Contacts, Contact } from 'ionic-native';
import { TreeNode } from '../../tree/tree-node';

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
        public params: NavParams
    ) {
        this.node = this.params.get('node');
        this.contacts = [];
        this.select = -1;
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
    }

    cancel() {
        this.viewCtrl.dismiss();
    }
}
