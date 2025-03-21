import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  Output,
  EventEmitter,
  HostListener,
  OnDestroy,
  input,
} from '@angular/core';

/**
 * A custom directive that allows us to expand/collapse detail rows in a Material table.
 */
@Directive({
  selector: '[cdkDetailRow]',
  standalone: true,
})
export class CdkDetailRowDirective implements OnDestroy {
  @Input() cdkDetailRow: any;                 // The row data
  @Input() cdkDetailRowTpl!: TemplateRef<any>; // The template to render when expanded
  @Input() autoTogleOnClick = false;
  @Output() toggleChange = new EventEmitter<boolean>();

  private embeddedView: EmbeddedViewRef<any> | null = null;
  private opened = false;

  constructor(private viewContainer: ViewContainerRef) {}

  @HostListener('click')
  onClickRow() {
    this.toggle();
  }

  toggle(): void {
    if (this.opened) {
      // Close
      this.viewContainer.clear();
      this.opened = false;
      this.toggleChange.emit(false);
    } else {
      // Open
      this.embeddedView = this.viewContainer.createEmbeddedView(this.cdkDetailRowTpl, {
        $implicit: this.cdkDetailRow,
        element: this.cdkDetailRow,
      });
      this.opened = true;
      this.toggleChange.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }
}
