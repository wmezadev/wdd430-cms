import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesUrl = `${import.meta.env['NG_APP_FIREBASE_URL']}/messages.json`;
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.getMessages();
  }
  
  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const messagesString = JSON.stringify(this.messages);
    this.http.put(this.messagesUrl, messagesString, { headers })
    .subscribe({
      next: () => {
        this.messageChangedEvent.next(this.messages.slice());
      },
      error: (error: any) => {
        console.error('Error storing messages:', error);
      }
    });
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const newDocument = JSON.parse(JSON.stringify(message));
    this.http.post<{ name: string }>(
      this.messagesUrl,
      newDocument,
      { headers }
    ).subscribe({
      next: (responseData) => {
        this.messages.push(message);
        this.storeMessages();
      },
      error: (error: any) => {
        console.error('Error adding message:', error);
      }
    });
  }

  getMessages() {
    this.http.get<Message[]>(this.messagesUrl)
      .subscribe({
        next: (messages: Message[] ) => {
          this.messages = messages;
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });
  }

  getMessage(id: string): Message | null {
    return this.messages.find(message => message.id === id) || null;
  }
}
