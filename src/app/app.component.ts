import { Component, signal } from '@angular/core';
import { MasterDetailTableComponent } from './table/master-detail-table.component';
import { Action, NestedMapping, TableData } from './table/model/master-detail-table.model'; 
import { TableHeaderBuilder, SimpleColumn, ActionColumn } from './table/model/table-header-builder'; 
import { DtoOrder, MockMasterDetailTableDataService } from './table/service/mock-master-detail-table-data.service';
import { NestedTableBuilder } from './table/service/nested-table-builder';
import { syncHeadersRecursively } from './table/service/master-detail-table.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MasterDetailTableComponent],
  template: `
    <h1>Recursive Master-Detail Table</h1>
    <app-master-detail-table [dataSignal]="tableSignal"></app-master-detail-table>
  `,
})
export class AppComponent {
 
  tableSignal = signal<TableData>({} as TableData);
  actions: Action[] = [{
    label: 'Edit',
    action: (row) => this.editRow(row)
  }, {
    label: 'Delete',
    action: (row) => this.deleteRow(row)
  }];
  // Define header arrays and nested mapping plan.
  private orderHeaders = new TableHeaderBuilder()
    .withHiddenHeader(false) 
    .withColumn(new SimpleColumn('orderID', 'Order ID'))
    .withColumn(new SimpleColumn('value', 'Value'))
    .withColumn(new ActionColumn('actions', 'Actions', this.actions))
    .build();

  private invoiceHeaders = new TableHeaderBuilder()
    .withHiddenHeader(false) 
    .withColumn(new SimpleColumn('id', 'Invoice ID'))
    .withColumn(new SimpleColumn('valueInvoice', 'Invoice Value'))
    .build();

  private shipmentHeaders = new TableHeaderBuilder()
    .withHiddenHeader(false) 
    .withColumn(new SimpleColumn('shipmentID', 'Shipment ID'))
    .withColumn(new SimpleColumn('shipmentValue', 'Shipment Value'))
    .withColumn(new ActionColumn('actions', 'Actions', this.actions))
    .build();

  // Create the nested mapping plan.
  private nestedMapping: NestedMapping = {
    dtoInvoices: {
      headers: this.invoiceHeaders,
      autoHide: false,
      nestedMapping: {
        dtoShippements: {
          headers: this.shipmentHeaders
        }
      }
    }
  };

  constructor(private readonly mockService: MockMasterDetailTableDataService) {}

  ngOnInit(): void {
    this.mockService.getMockOrders().subscribe((orders: DtoOrder[]) => {
      // Convert the orders DTO list into our nested TableData model.
      const tableData: TableData = NestedTableBuilder.buildTable(
        this.orderHeaders,
        orders,
        this.nestedMapping
      );
      syncHeadersRecursively(tableData);
      this.tableSignal.set(tableData);
      console.log('Mapped TableData:', tableData);
    });
  }

  deleteRow(row: any): void {
    alert("delete  ==> "+JSON.stringify(row) );
  }
  editRow(row: any): void {
    alert("edit  ==> "+JSON.stringify(row) );
  }
}