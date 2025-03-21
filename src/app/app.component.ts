import { Component, signal } from '@angular/core';
import { MasterDetailTableComponent } from './table/master-detail-table.component';
import { Action, NestedMapping, TableData } from './table/model/master-detail-table.model';
import { TableHeaderBuilder, SimpleColumn, ActionColumn } from './table/model/table-header-builder';
import { DtoOrder, MockMasterDetailTableDataService } from './table/service/mock-master-detail-table-data.service';
import { NestedTableBuilder } from './table/service/nested-table-builder';
import { syncHeadersRecursively } from './table/service/master-detail-table.service';
import { ActionsBuilder } from './table/builder/actions.builder';
import { NestedMappingBuilder } from './table/builder/nested-mapping.builder';

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
  private orderActions: Action[] = new ActionsBuilder()
    .addAction('Edit', (row) => this.editRow(row))
    .addAction('Delete', (row) => this.deleteRow(row))
    .build();
    private shippmentActions: Action[] = new ActionsBuilder()
    .addAction('action A', (row) => alert("shippmentActions + action A \n"+JSON.stringify(row)))
    .addAction('action B', (row) => alert("shippmentActions + action B \n"+JSON.stringify(row)))
    .build();

  // Define header arrays and nested mapping plan.
  private orderHeaders = new TableHeaderBuilder()
    .withHiddenHeader(false)
    .withColumn(new SimpleColumn('orderID', 'Order ID'))
    .withColumn(new SimpleColumn('value', 'Value'))
    .withColumn(new ActionColumn('actions', 'Actions', this.orderActions))
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
    .withColumn(new ActionColumn('actions', 'Actions', this.shippmentActions))
    .build();

  // Create the nested mapping plan.
  // Build nested mapping for shippements
  shippementNestedTable = new NestedMappingBuilder()
    .addMapping('dtoShippements', this.shipmentHeaders)
    .build();

  // Build nested mapping for invoices, using the shippement mapping
  invoiceNestedTable = new NestedMappingBuilder()
    .addMapping('dtoInvoices', this.invoiceHeaders, false, this.shippementNestedTable)
    .build();

  // Finally, build the order table using the invoice nested mapping



  constructor(private readonly mockService: MockMasterDetailTableDataService) { }

  ngOnInit(): void {
    console.table(this.orderHeaders)
    this.mockService.getMockOrders().subscribe((orders: DtoOrder[]) => {
      // Convert the orders DTO list into our nested TableData model.
      const orderTable = NestedTableBuilder.buildTable(
        this.orderHeaders,
        orders,
        this.invoiceNestedTable
      );


      syncHeadersRecursively(orderTable);
      this.tableSignal.set(orderTable);
      console.log('Mapped TableData:', orderTable);
    });
  }

  deleteRow(row: any): void {
    alert("delete  ==> " + JSON.stringify(row));
  }
  editRow(row: any): void {
    alert("edit  ==> " + JSON.stringify(row));
  }
}