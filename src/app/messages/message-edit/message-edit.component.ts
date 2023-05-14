import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('subjectInputRef') subjectInputRef!: ElementRef;
  @ViewChild('msgTextInputRef') msgTextInputRef!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = 'William Meza'; // Hardcoded for now

  constructor() { }

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const newMessage = new Message(
      `${Math.floor(Math.random() * 1000) + 1}`, 
      this.currentSender, 
      subject, 
      msgText
    );

    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
  
}
