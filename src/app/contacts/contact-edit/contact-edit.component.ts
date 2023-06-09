import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact!: Contact | null;
  contact: Contact = new Contact('', '', '', '', '', null);
  editMode = false;
  groupContacts: Contact[] = [];
  hasInvalidGroupContact: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(id);
      if (!this.originalContact) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.contact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newContact = new Contact(
      `${Math.floor(Math.random() * 1000) + 1}`, // random string
      values.name,
      values.email,
      values.phone,
      values.imageUrl || '',
      this.groupContacts.length > 0 ? this.groupContacts : null
    );

    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return; // Index is out of range, exit method
    }
    this.groupContacts.splice(index, 1); // Remove the contact at the specified index from the groupContacts array
  }
  

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      this.hasInvalidGroupContact = true;
      return; // Contact already in the group, exit method
    }
    this.hasInvalidGroupContact = false;
    this.groupContacts.push(selectedContact); // Add the selectedContact to the groupContacts array
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true; // newContact has no value
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true; // Same contact, already in the group
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true; // Contact already exists in the groupContacts array
      }
    }
    return false; // Valid contact, not in the group
  }
}
