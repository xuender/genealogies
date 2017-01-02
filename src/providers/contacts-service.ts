import { filter } from 'underscore';
import { Injectable } from '@angular/core';
import { Contacts, Contact } from 'ionic-native';

@Injectable()
export class ContactsService {
    contacts: Contact[];
    constructor() {}

    filter(name: string): Promise<Array<Contact>> {
        return new Promise((resolve, reject) => {
            if (this.contacts) {
                resolve(filter(this.contacts, c => c.displayName === name));
            } else {
                Contacts.find(['displayName'], {
                    filter: '',
                    multiple: true,
                    desiredFields: ['name', 'displayName', 'photos', 'birthday', 'phoneNumbers'],
                    hasPhoneNumber: true
                })
                .then((contacts) => {
                    if (contacts) {
                        this.contacts = contacts;
                        // console.log(JSON.stringify(countBy(this.contacts, (c) => c.displayName)));
                        resolve(filter(this.contacts, (c) => c.displayName === name));
                    } else {
                        this.contacts = [];
                        reject();
                    }
                }, () => {
                    this.contacts = [];
                    reject();
                });
            }
        });
    }

    disabled(): boolean {
        return this.contacts && this.contacts.length === 0;
    }
}
