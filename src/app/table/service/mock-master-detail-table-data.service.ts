import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * DTO definitions coming from the backend.
 */
export interface DtoOrder {
  orderID: number;
  value: string;
  dtoInvoices?: DtoInvoice[];
}

export interface DtoInvoice {
  id: number;
  valueInvoice: string;
  dtoShippements?: DtoShippement[];
}

export interface DtoShippement {
  shipmentID: number;
  shipmentValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockMasterDetailTableDataService {
  constructor() {}

  /**
   * Returns a simple mock response representing a list of orders.
   * Each order may have zero or more invoices, and each invoice may have zero or more shippements.
   */
  getMockOrders(): Observable<DtoOrder[]> {
    const mockOrders: DtoOrder[] = [
        {
          orderID: 1,
          value: '1000 USD',
          dtoInvoices: [
            {
              id: 101,
              valueInvoice: 'Invoice 101',
              dtoShippements: [
                { shipmentID: 1001, shipmentValue: 'Shipment A' },
                { shipmentID: 1002, shipmentValue: 'Shipment B' }
              ]
            },
            {
              id: 102,
              valueInvoice: 'Invoice 102',
              dtoShippements: []
            }
          ]
        },
        {
          orderID: 2,
          value: '2000 USD',
          dtoInvoices: []
        },
        {
          orderID: 3,
          value: '3000 USD',
          dtoInvoices: [
            {
              id: 103,
              valueInvoice: 'Invoice 103',
              dtoShippements: [
                { shipmentID: 1003, shipmentValue: 'Shipment C' }
              ]
            }
          ]
        },
        {
          orderID: 4,
          value: '4000 USD',
          dtoInvoices: [
            {
              id: 104,
              valueInvoice: 'Invoice 104',
              dtoShippements: [
                { shipmentID: 1004, shipmentValue: 'Shipment D' },
                { shipmentID: 1005, shipmentValue: 'Shipment E' },
                { shipmentID: 1006, shipmentValue: 'Shipment F' }
              ]
            },
            {
              id: 105,
              valueInvoice: 'Invoice 105',
              dtoShippements: [
                { shipmentID: 1007, shipmentValue: 'Shipment G' }
              ]
            }
          ]
        },
        {
          orderID: 5,
          value: '5000 USD',
          dtoInvoices: [
            {
              id: 106,
              valueInvoice: 'Invoice 106',
              dtoShippements: [
                { shipmentID: 1008, shipmentValue: 'Shipment H' },
                { shipmentID: 1009, shipmentValue: 'Shipment I' },
                { shipmentID: 1010, shipmentValue: 'Shipment J' },
                { shipmentID: 1011, shipmentValue: 'Shipment K' }
              ]
            }
          ]
        },
        {
          orderID: 6,
          value: '6000 USD',
          dtoInvoices: []
        },
        {
          orderID: 7,
          value: '7000 USD',
          dtoInvoices: [
            {
              id: 107,
              valueInvoice: 'Invoice 107',
              dtoShippements: []
            }
          ]
        },
        {
          orderID: 8,
          value: '8000 USD',
          dtoInvoices: [
            {
              id: 108,
              valueInvoice: 'Invoice 108',
              dtoShippements: [
                { shipmentID: 1012, shipmentValue: 'Shipment L' }
              ]
            },
            {
              id: 109,
              valueInvoice: 'Invoice 109',
              dtoShippements: []
            },
            {
              id: 110,
              valueInvoice: 'Invoice 110',
              dtoShippements: [
                { shipmentID: 1013, shipmentValue: 'Shipment M' },
                { shipmentID: 1014, shipmentValue: 'Shipment N' }
              ]
            }
          ]
        }
      ];

    return of(mockOrders);
  }
}
