import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentsUrl = `${import.meta.env['NG_APP_FIREBASE_URL']}/documents.json`;
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    this.getDocuments();
  }

  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const documentsString = JSON.stringify(this.documents);
    this.http.put(this.documentsUrl, documentsString, { headers })
    .subscribe({
      next: () => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error: any) => {
        console.error('Error storing documents:', error);
      }
    });
  }
  
  addDocument(document: Document) {
    if (document == null || !document.name) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    document.id = `${this.getMaxId() +1}`;
    const newDocument = JSON.parse(JSON.stringify(document));
    this.http.post<{ name: string }>(
      this.documentsUrl,
      newDocument,
      { headers }
    ).subscribe({
      next: (responseData) => {
        this.documents.push(document);
        this.storeDocuments();
      },
      error: (error: any) => {
        console.error('Error adding document:', error);
      }
    });
  }

  getDocuments() {
    this.http.get<Document[]>(this.documentsUrl)
      .subscribe({
        next: (documents: Document[] ) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
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
    this.documents[index] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const index = this.documents.findIndex(d => d.id === document.id);
    if (index === -1) {
      return;
    }
    this.documents.splice(index, 1);
    this.storeDocuments();
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
}
