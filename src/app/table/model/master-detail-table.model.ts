import { CdkDetailRowDirective } from "../cdk-detail-row.directive";

/** Interfaces for headers, rows, and table data */
export interface Action {
    label: string;
    action: (row: any) => void;
  }

export interface TableHeader {
    name: string;
    id: string;
    sortCallback?: (a: any, b: any) => number;
    visible: boolean;
    hideRow: boolean;
    actions?: Action[];
}

export interface TableRow {
    data: { [key: string]: any };
    detailData?: TableData;
    _detailDirective?: CdkDetailRowDirective;  
  }

export interface TableData {
    headers: TableHeader[];
    rows: TableRow[];
}

export interface NestedMapping {
    [property: string]: {
      headers: TableHeader[];
      autoHide?: boolean;
      nestedMapping?: NestedMapping;
    };
  }