import { Action } from "../model/master-detail-table.model";

 

export class ActionsBuilder {
  private actions: Action[] = [];

  addAction(label: string, action: (row: any) => void): this {
    this.actions.push({ label, action });
    return this;
  }

  build(): Action[] {
    return this.actions;
  }
}