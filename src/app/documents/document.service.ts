import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentsUrl = `${import.meta.env['NG_APP_API_URL']}/documents`;
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.documents = [];
    this.maxDocumentId = this.getMaxId();
    this.getDocuments();
  }
  
  addDocument(document: Document) {
    if (document == null || !document.name) {
      return;
    }
    document.id = `${this.getMaxId() +1}`;
    const newDocument = JSON.parse(JSON.stringify(document));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post<{ message: string, document: Document }>(
      this.documentsUrl,
      newDocument,
      { headers }
    ).subscribe({
      next: (response) => {
        this.documents.push(response.document);
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error('Error adding document:', error);
      }
    });
  }

  getDocuments() {
    this.http.get<{ message: string, documents: Document[]}>(this.documentsUrl)
      .subscribe({
        next: (response) => {
          this.documents = response.documents;
          this.sortAndSend();
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });
  }  

  getDocument(id: string): Document | null {
    return this.documents.find(document => document.id === id) || null;
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const index = this.documents.findIndex(d => d.id === originalDocument.id);
    if (index === -1) {
      return;
    }
    newDocument.id = originalDocument.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put<{ message: string, document: Document }>(
      `${this.documentsUrl}/${originalDocument.id}`,
      newDocument,
      { headers }
    ).subscribe({
      next: (response) => {
        this.documents[index] = response.document;
        this.sortAndSend();
      },
      error: (error: any) => {
        console.error('Error adding contact:', error);
      }
    });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const index = this.documents.findIndex(d => d.id === document.id);
    if (index === -1) {
      return;
    }
    this.http.delete<{ message: string, document: Document}>(`${this.documentsUrl}/${document.id}`)
      .subscribe(
        (response) => {
          this.documents.splice(index, 1);
          this.sortAndSend();
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  sortAndSend(): void {
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
