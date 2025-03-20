import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Signal,
  signal,
  computed,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';          // needed for <mat-icon>
import { MatButtonModule } from '@angular/material/button';       // needed for <button mat-icon-button>
import { CdkDetailRowDirective } from './cdk-detail-row.directive'; // your custom directive

/** Interfaces for headers, rows, and table data */
export interface TableHeader {
  name: string;
  id: string;
  sortCallback?: (a: any, b: any) => number;
  visible: boolean;
  hideRow:boolean
}

export interface TableRow {
  data: { [key: string]: any };
  detailData?: TableData; // optional nested detail
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}

@Component({
  selector: 'app-master-detail-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    CdkDetailRowDirective,
    // Not referencing itself; remove MasterDetailTableComponent from imports to avoid warnings
  ],
  templateUrl: './master-detail-table.component.html',
  styleUrls: ['./master-detail-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDetailTableComponent {
  @Input() dataSignal!: Signal<TableData>;
  @Input() depth: number = 0;

  @HostBinding('class') get layerClass() {
    return `layer-${this.depth}`; // Bind host class to layer-{depth}
  }
  /**
   * Compute the list of visible column IDs,
   * plus optionally "expandCollapse" if you want the expand icon column.
   */
  displayedColumns = computed(() => {
    let columns = this.dataSignal()
      .headers
      .filter((h) => h.visible)
      .map((h) => h.id);

    // Optionally add the expand/collapse column to the end
    columns = ['expandCollapse',...columns]
    return columns;
  });

  /**
   * Called whenever the detail row toggles open/close.
   * 'isOpen' is true if being opened, false if closed.
   */
  onToggleChange(isOpen: boolean, row: TableRow): void {
    // For example, toggle a "close" property on row.data to swap icons
    row.data['close'] = !row.data['close'];
  }

  /**
   * Example row click or scroll event
   */
  scroll(evt: Event): void {
    console.log('Row clicked or scrolled:', evt);
  }

  /**
   * Compare two header arrays for equality based on (id, name, visible).
   */
  areHeadersEqual(master: TableHeader[], detail: TableHeader[]): boolean {
    if (master.length !== detail.length) {
      return false;
    }
    return master.every((mHeader, index) => {
      const dHeader = detail[index];
      return (
        mHeader.id === dHeader.id &&
        mHeader.name === dHeader.name &&
        mHeader.visible === dHeader.visible
      );
    });
  }

  /**
   * Utility method to create a Signal from nested TableData (for recursion).
   */
  createSignal(detailData: TableData, hideHeaders :boolean = false): Signal<TableData> {
    if(hideHeaders) detailData.headers.map(header => header.visible = false)
    return signal(detailData);
  }

  hideRow(headers: TableHeader[]):boolean{
    return headers.some(head => head.hideRow === true);
  }
}
