import { NestedMapping, TableHeader } from "../model/master-detail-table.model";

export class NestedMappingBuilder {
    private mapping: NestedMapping = {};
  
    /**
     * Add a nested property to this mapping.
     * @param property The property name in your DTO (e.g. 'dtoInvoices').
     * @param headers  The headers array for this property’s table.
     * @param autoHide Optional boolean. If true, the nested headers become hidden rows.
     * @param nestedMapping Another NestedMapping to nest deeper.
     */
    addMapping(
      property: string,
      headers: TableHeader[],
      autoHide: boolean = false,
      nestedMapping?: NestedMapping
    ): this {
      this.mapping[property] = {
        headers,
        autoHide,
        nestedMapping,
      };
      return this;
    }
  
    build(): NestedMapping {
      return this.mapping;
    }
  }