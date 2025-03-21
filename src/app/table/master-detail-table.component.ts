import {
    Component,
    Input,
    ChangeDetectionStrategy,
    Signal,
    signal,
    computed,
    HostBinding,
    ViewChildren,
    QueryList,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MatTableModule } from '@angular/material/table';
  import { MatExpansionModule } from '@angular/material/expansion';
  import { MatIconModule } from '@angular/material/icon';
  import { MatButtonModule } from '@angular/material/button';
  import { MatMenuModule } from '@angular/material/menu';
  import { CdkDetailRowDirective } from './directive/cdk-detail-row.directive';
  import { TableData, TableHeader, TableRow, Action } from './model/master-detail-table.model';
  
  @Component({
    selector: 'app-master-detail-table',
    standalone: true,
    imports: [
      CommonModule,
      MatTableModule,
      MatExpansionModule,
      MatIconModule,
      MatButtonModule,
      MatMenuModule,
      CdkDetailRowDirective,
    ],
    templateUrl: './master-detail-table.component.html',
    styleUrls: ['./master-detail-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class MasterDetailTableComponent {
    @Input() dataSignal!: Signal<TableData>;
    @Input() depth: number = 0;
  
    @HostBinding('class') get layerClass() {
      return `layer-${this.depth}`;
    }
  
    // Query all instances of our detail row directive.
    @ViewChildren(CdkDetailRowDirective) detailDirectives!: QueryList<CdkDetailRowDirective>;
  
    displayedColumns = computed(() => {
      let columns = this.dataSignal().headers.filter(h => h.visible).map(h => h.id);
      // Optionally, add any extra columns (e.g., actions, expandCollapse)
      if (this.dataSignal().headers.some(h => h.id === 'actions') && !columns.some(col => col === 'actions')) {
        columns.push('actions');
      }
      const hasChildTable = this.dataSignal().rows.some(row => row.detailData);
      return hasChildTable ? ['expandCollapse', ...columns] : columns;
    });
  
    onToggleChange(isOpen: boolean, row: TableRow): void {
      row.data['close'] = !row.data['close'];
    }
  
    scroll(evt: Event): void {
      console.log('Row clicked or scrolled:', evt);
    }
  
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
  
    createSignal(detailData: TableData, hideHeaders: boolean = false): Signal<TableData> {
      if (hideHeaders) detailData.headers.forEach(header => header.visible = false);
      return signal(detailData);
    }
  
    hideRow(headers: TableHeader[]): boolean {
      return headers.some(head => head.hideRow === true);
    }
  
    // Helper method: find the directive instance for the given row and toggle it.
    toggleRow(row: TableRow, event: Event): void {
      event.stopPropagation();
      const directive = this.detailDirectives.find(d => d.cdkDetailRow === row);
      if (directive) {
        directive.toggle();
      }
    }
  
    // Helper method for Action Column (if used)
    getActions(): Action[] {
      const actionHeader = this.dataSignal().headers.find(h => h.id === 'actions');
      return actionHeader?.actions || [];
    }
  
    executeAction(action: Action, row: any): void {
      action.action(row);
    }
  }
  