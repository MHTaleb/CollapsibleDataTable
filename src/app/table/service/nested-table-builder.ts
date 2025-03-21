import { NestedMapping, TableData, TableHeader, TableRow } from '../model/master-detail-table.model';


export class NestedTableBuilder {
  static buildTable(
    headers: TableHeader[],
    data: any[],
    nestedMapping?: NestedMapping
  ): TableData {
    return {
      headers,
      rows: this.buildRows(headers, data, nestedMapping)
    };
  }

  static buildRows(
    headers: TableHeader[],
    data: any[],
    nestedMapping?: NestedMapping
  ): TableRow[] {
    return data.map(record => this.buildRow(headers, record, nestedMapping));
  }

  static buildRow(
    headers: TableHeader[],
    record: any,
    nestedMapping?: NestedMapping
  ): TableRow {
    const row: TableRow = { data: {} };
    headers.forEach(header => {
      row.data[header.id] = record[header.id];
    });
    if (nestedMapping) {
      for (const prop in nestedMapping) {
        if (record[prop] && Array.isArray(record[prop]) && record[prop].length > 0) {
          const mapping = nestedMapping[prop];
          const nestedHeaders = mapping.autoHide
            ? mapping.headers.map(h => ({ ...h, hideRow: true }))
            : mapping.headers;
          row.detailData = this.buildTable(nestedHeaders, record[prop], mapping.nestedMapping);
          break; // Stop after first nested mapping (adjust if needed).
        }
      }
    }
    return row;
  }
}
