import { Inject, Injectable } from "@angular/core";
import { TableData, TableHeader, TableRow } from "../model/master-detail-table.model";

@Injectable(
    {
        providedIn : "root"
    }
)
export class MasterDetailTableRowBuilder{
    buildRow(headers : TableHeader[], data : any) : TableRow {
        const row: TableRow = { data: {} };

        headers.forEach(header => {
          // Extract the value for each header based on header.id.
          // This assumes that the key in the JSON matches header.id.
          row.data[header.id] = data[header.id];
        });
    
        return row;
    }
}

export function syncHeadersRecursively(tableData: TableData): void {
    for (const row of tableData.rows) {
        if (row.detailData) {
            syncParentChildHeaders(tableData.headers, row.detailData.headers);
            syncHeadersRecursively(row.detailData);
        }
    }
}

function syncParentChildHeaders(parentHeaders: TableHeader[], childHeaders: TableHeader[]): void {
    // Ensure child has filler columns for parent's columns
    for (const pHeader of parentHeaders) {

        if (parentHeaders.filter(p => p.visible).length > childHeaders.filter(p => p.visible).length) {
            childHeaders.push({
                name: '__',
                id: 'filler_' + pHeader.id,
                visible: true,
                hideRow: false,
            });
        }
    }

    // Ensure parent has filler columns for child's columns
    for (const cHeader of childHeaders) {

        if (childHeaders.filter(p => p.visible).length > parentHeaders.filter(p => p.visible).length) {
            parentHeaders.push({
                name: '__',
                id: 'filler_' + cHeader.id,
                visible: true,
                hideRow: false,
            });
        }
    }
}