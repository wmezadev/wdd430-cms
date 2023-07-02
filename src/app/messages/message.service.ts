import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesUrl = `${import.meta.env['NG_APP_API_URL']}/messages`;
  messages: Message[] = [];
  maxMessageId: number;
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {
    this.messages = [];
    this.maxMessageId = this.getMaxId();
    this.getMessages();
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    const newMessage = JSON.parse(JSON.stringify(message));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, data: Message }>(
      this.messagesUrl,
      newMessage,
      { headers }
    ).subscribe({
      next: (response) => {
        this.messages.push(response.data);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error('Error adding document:', error);
      }
    });
  }

  getMessages() {
    this.http.get<{ message: string, data: Message[] }>(this.messagesUrl)
      .subscribe({
        next: (response) => {
          this.messages = response.data;
          this.sortAndSend();
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });
  }

  getMessage(id: string): Message | null {
    return this.messages.find(message => message.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  sortAndSend(): void {
    this.maxMessageId = this.getMaxId();
    //this.messages.sort((a, b) => a.id.localeCompare(b.id));
    this.messageListChangedEvent.next(this.messages.slice());
  }
}
