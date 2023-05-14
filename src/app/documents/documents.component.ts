import { Component } from '@angular/core';
import { Document } from './document.model';
@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  documents: Document[] = [
    new Document(
      "1",
      "Document 1",
      "Description of Document 1",
      "https://example.com/document1",
      []
    ),
    new Document(
      "2",
      "Document 2",
      "Description of Document 2",
      "https://example.com/document2",
      []
    ),
    new Document(
      "3",
      "Document 3",
      "Description of Document 3",
      "https://example.com/document3",
      []
    ),
    new Document(
      "4",
      "Document 4",
      "Description of Document 4",
      "https://example.com/document4",
      []
    ),
    new Document(
      "5",
      "Document 5",
      "Description of Document 5",
      "https://example.com/document5",
      []
    )
  ];

  selectedDocument!: Document;
}
