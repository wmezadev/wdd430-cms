import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsUrl = `${import.meta.env['NG_APP_FIREBASE_URL']}/contacts.json`;
  contacts: Contact[] = [];
  maxContactId: number;
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contactChangedEvent: EventEmitter<Contact[]> = new EventEmitter<Contact[]>();

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
    this.getContacts();
  }

  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const contactsString = JSON.stringify(this.contacts);
    this.http.put(this.contactsUrl, contactsString, { headers })
    .subscribe({
      next: () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (error: any) => {
        console.error('Error storing contacts:', error);
      }
    });
  }

  addContact(contact: Contact) {
    if (contact == null || !contact.name) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    contact.id = `${this.getMaxId() +1}`;
    const newContact = JSON.parse(JSON.stringify(contact));
    this.http.post<{ name: string }>(
      this.contactsUrl,
      newContact,
      { headers }
    ).subscribe({
      next: (responseData) => {
        this.contacts.push(contact);
        this.storeContacts();
      },
      error: (error: any) => {
        console.error('Error adding contact:', error);
      }
    });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const index = this.contacts.findIndex(d => d.id === originalContact.id);
    if (index === -1) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[index] = newContact;
    this.storeContacts();
  }

  getContacts() {
    this.http.get<Contact[]>(this.contactsUrl)
      .subscribe({
        next: (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    const index = this.contacts.findIndex(d => d.id === contact.id);
    if (index === -1) {
      return;
    }
    this.contacts.splice(index, 1);
    this.storeContacts();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
