import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

/**
 * A custom directive that allows us to expand/collapse detail rows in a Material table.
 */
@Directive({
  selector: '[cdkDetailRow]',
  exportAs: 'cdkDetailRow',
  standalone: true,
})
export class CdkDetailRowDirective implements OnDestroy {
  @Input() cdkDetailRow: any;                 // The row data
  @Input() cdkDetailRowTpl!: TemplateRef<any>; // The template to render when expanded
  @Output() toggleChange = new EventEmitter<boolean>();

  private embeddedView: EmbeddedViewRef<any> | null = null;
  private opened = false;

  toggle(): void {
    if (this.opened) {
      this.viewContainer.clear();
      this.opened = false;
      this.toggleChange.emit(false);
    } else {
      this.embeddedView = this.viewContainer.createEmbeddedView(this.cdkDetailRowTpl, {
        $implicit: this.cdkDetailRow,
        element: this.cdkDetailRow,
      });
      this.opened = true;
      this.toggleChange.emit(true);
    }
  }

  constructor(private viewContainer: ViewContainerRef) {}

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }
}
