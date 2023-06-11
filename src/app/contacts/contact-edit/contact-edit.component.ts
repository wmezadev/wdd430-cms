import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { group } from '@angular/animations';

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
      null // group pending
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

  onRemoveItem(i: any) {}
}
