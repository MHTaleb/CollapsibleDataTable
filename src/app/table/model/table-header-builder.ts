import { Action, TableHeader } from './master-detail-table.model';

export class SimpleColumn {
  constructor(
    public id: string,
    public title: string,
    public visible: boolean = true
  ) {}

  toTableHeader(hideRow: boolean): TableHeader {
    return {
      name: this.title,
      id: this.id,
      visible: this.visible,
      hideRow: hideRow,
    };
  }
}

export class ActionColumn {
  constructor(
    public id: string,
    public title: string,
    public actions: Action[], // define your action type if needed
    public visible: boolean = true
  ) {}

  toTableHeader(hideRow: boolean): TableHeader {
    return {
      name: this.title,
      id: this.id,
      visible: this.visible,
      hideRow: hideRow,
      actions: this.actions
    } as TableHeader;
  }
}

export class TableHeaderBuilder {
  private headers: TableHeader[] = [];
  private hiddenHeader: boolean = false;

  withHiddenHeader(hidden: boolean): this {
    this.hiddenHeader = hidden;
    return this;
  }

  withColumn(column: SimpleColumn | ActionColumn): this {
    this.headers.push(column.toTableHeader(this.hiddenHeader));
    return this;
  }

  build(): TableHeader[] {
    return this.headers;
  }
}
