import { Component, Input } from '@angular/core';
import { Contact } from '../../contact.model';

@Component({
  selector: 'cms-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;

  setFallbackImage() {
    // Set the fallback image URL
    if(this.contact){
      this.contact.imageUrl = 'https://placehold.co/60x80';
    }
  }
}
