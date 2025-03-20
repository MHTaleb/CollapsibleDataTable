import { Component, Input, ChangeDetectionStrategy, Signal, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

// Interfaces for headers, rows, and table data
export interface TableHeader {
  name: string;
  id: string;
  sortCallback?: (a: any, b: any) => number;
  visible: boolean;
}

export interface TableRow {
  data: { [key: string]: any }; // Each key corresponds to a header id
  detailData?: TableData;       // Optional nested detail data
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}

@Component({
  selector: 'app-master-detail-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatExpansionModule, MasterDetailTableComponent],
  templateUrl:"./master-detail-table.component.html",
  styles: [`
    .data-row {
      cursor: pointer;
    }
    .detail-row {
      background: #f9f9f9;
    }
    .inline-detail {
      display: flex;
      border-bottom: 1px solid #ccc;
      padding: 4px 0;
    }
    .detail-cell {
      margin-right: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterDetailTableComponent {
    @Input() dataSignal!: Signal<TableData>;
  
    /**
     * We keep track of which row is expanded. If you want multiple rows
     * expanded at once, you might store a Set<TableRow> or something similar.
     */
    expandedRow = signal<TableRow | null>(null);
  
    /**
     * A computed signal for the currently visible column IDs.
     */
    displayedColumns = computed(() =>
      this.dataSignal()
        .headers
        .filter((h) => h.visible)
        .map((h) => h.id)
    );
  
    /**
     * We define a function that determines which row is our "detail row".
     * This function is used with `when: isExpansionDetailRow` in matRowDef.
     */
    isExpansionDetailRow = (index: number, rowData: TableRow) => {
      // The detail row is shown if `rowData` is the one expanded
      // We cheat by checking if "expandedRow() === rowData".
      // But note: the rowData that is tested for the second row is the same reference
      // as for the main row. If they match, we show the detail row right after it.
      return this.expandedRow() === rowData;
    };
  
    /**
     * Toggles expansion. If the row is expanded, close it; otherwise expand it.
     */
    toggleExpand(row: TableRow): void {
      this.expandedRow.update((current) => (current === row ? null : row));
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
     * Utility method to create a signal from TableData.
     */
    createSignal(detailData: TableData): Signal<TableData> {
      return signal(detailData);
    }
  }