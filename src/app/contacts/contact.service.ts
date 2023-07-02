import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactsUrl = `${import.meta.env['NG_APP_API_URL']}/contacts`;
  contacts: Contact[] = [];
  maxContactId: number;
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contactChangedEvent: EventEmitter<Contact[]> = new EventEmitter<Contact[]>();

  constructor(private http: HttpClient) {
    this.contacts = [];
    this.maxContactId = this.getMaxId();
    this.getContacts();
  }

  addContact(contact: Contact) {
    if (contact == null || !contact.name) {
      return;
    }
    contact.id = `${this.getMaxId() +1}`;
    const newContact = JSON.parse(JSON.stringify(contact));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, contact: Contact }>(
      this.contactsUrl,
      newContact,
      { headers }
    ).subscribe({
      next: (response) => {
        this.contacts.push(response.contact);
        this.sortAndSend();
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put<{ message: string, contact: Contact }>(
      `${this.contactsUrl}/${originalContact.id}`,
      newContact,
      { headers }
    ).subscribe({
      next: (response) => {
        this.contacts[index] = response.contact;
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error('Error adding contact:', error);
      }
    });
  }

  getContacts() {
    this.http.get<{ message: string, contacts: Contact[]}>(this.contactsUrl)
      .subscribe({
        next: (response) => {
          this.contacts = response.contacts;
          this.sortAndSend();
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
    this.http.delete<{ message: string, contact: Contact}>(`${this.contactsUrl}/${contact.id}`)
      .subscribe(
        (response) => {
          this.contacts.splice(index, 1);
          this.sortAndSend();
        }
      );
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

  sortAndSend(): void {
    this.maxContactId = this.getMaxId();
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
