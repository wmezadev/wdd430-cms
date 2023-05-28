import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../services/wind-ref.service';
@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private windRefService: WindRefService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });
  }
  onView() {
    if (this.document) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    if (this.document) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    }
  }
}
