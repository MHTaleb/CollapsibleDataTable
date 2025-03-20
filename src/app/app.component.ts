import { Component, signal } from '@angular/core'; 
import { MasterDetailTableComponent, TableData } from './table/master-detail-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MasterDetailTableComponent],
  template: `
    <div class="container">
      <h1>Master Detail Table Example</h1>
      <app-master-detail-table [dataSignal]="tableDataSignal"></app-master-detail-table>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
    }
  `]
})
export class AppComponent {
  // Define the master table data with nested detail data
  tableData: TableData = {
    headers: [
      { name: 'ID', id: 'id', visible: true },
      { name: 'Name', id: 'name', visible: true },
      { name: 'Status', id: 'status', visible: true }
    ],
    rows: [
      // Row with identical detail headers (will render inline rows)
      {
        data: { id: 1, name: 'John Doe', status: 'Active' },
        detailData: {
          headers: [
            { name: 'ID', id: 'id', visible: true },
            { name: 'Name', id: 'name', visible: true },
            { name: 'Status', id: 'status', visible: true }
          ],
          rows: [
            { data: { id: 101, name: 'John Detail A', status: 'Active' } },
            { data: { id: 102, name: 'John Detail B', status: 'Inactive' } }
          ]
        }
      },
      // Row with different detail headers (will render a nested table)
      {
        data: { id: 2, name: 'Jane Smith', status: 'Inactive' },
        detailData: {
          headers: [
            { name: 'ID', id: 'id', visible: true },
            { name: 'Description', id: 'description', visible: true }
          ],
          rows: [
            { data: { id: 201, description: 'Jane Detail 1' } },
            { data: { id: 202, description: 'Jane Detail 2' } }
          ]
        }
      },
      // Row without any detail data
      {
        data: { id: 3, name: 'Alice Johnson', status: 'Active' }
      }
    ]
  };

  // Create the signal
  tableDataSignal = signal(this.tableData);
}
