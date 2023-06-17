import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    this.getDocuments();
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
  
    this.maxDocumentId++;
    newDocument.id = `${this.maxDocumentId}`;
    this.documents.push(newDocument);
    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  getDocuments() {
    this.http.get<Document[]>(`${import.meta.env['NG_APP_FIREBASE_URL']}/documents.json`)
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
  
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
  
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }  

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
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
