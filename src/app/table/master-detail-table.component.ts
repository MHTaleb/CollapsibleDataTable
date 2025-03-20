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
    .detail-row {
      display: flex;
      padding: 8px;
      border-bottom: 1px solid #ccc;
    }
    .detail-cell {
      margin-right: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterDetailTableComponent {
  @Input() dataSignal!: Signal<TableData>;

  // Use a computed signal for displayed columns
  displayedColumns = computed(() =>
    this.dataSignal()
      .headers
      .filter(h => h.visible)
      .map(h => h.id)
  );

  /**
   * Compares two header arrays to determine if they are identical.
   * We compare based on header id, name, and visibility.
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

  onRowClick(row: TableRow): void {
    console.log('Row clicked:', row);
    // You can emit an event or handle the row click further here.
  }

  /**
   * Utility method to create a signal from a TableData object.
   * In a real app, you might have a more robust approach for generating/updating signals.
   */
  createSignal(detailData: TableData): Signal<TableData> {
    return signal(detailData);
  }
}
