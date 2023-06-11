import { Component } from '@angular/core';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent {
  groupContacts: any;
  onRemoveItem (i: any): void { }
  onCancel (): void { }
}
