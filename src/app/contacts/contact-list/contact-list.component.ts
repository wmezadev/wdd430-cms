import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  subscription: Subscription = new Subscription();
  term: string = '';  

  constructor(private contactService: ContactService) {
    
  }

  ngOnInit() {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search(value: string) {
    this.term = value.trim().toLowerCase();
  }  
}
