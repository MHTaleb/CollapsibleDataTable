import { Component, signal } from '@angular/core';
import { MasterDetailTableComponent, TableData, TableHeader } from './table/master-detail-table.component';

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
   megaProjectData: TableData = {
    headers: [
      { name: 'Project ID', id: 'id', visible: true, hideRow: false },
      {
        name: 'Project Name', id: 'projectName', visible: true,
        hideRow: false
      },
      {
        name: 'Program Manager', id: 'manager', visible: true,
        hideRow: false
      },
      {
        name: 'Strategic Goal', id: 'goal', visible: true,
        hideRow: false
      },
      {
        name: 'Global Budget', id: 'budget', visible: true,
        hideRow: false
      },
    ],
    rows: [
      // ================== LEVEL 1 (MASTER) - 2 ROWS ==================
      {
        data: {
          id: 'GLOBAL-1',
          projectName: 'Interstellar Infrastructure',
          manager: 'Dr. Celeste Orion',
          goal: 'Deep Space Expansion',
          budget: '₵250B'
        },
        detailData: { // LEVEL 2 - 4 ROWS
          headers: [
            {
              name: 'Hub ID', id: 'hubId', visible: true,
              hideRow: false
            },
            {
              name: 'Location', id: 'location', visible: true,
              hideRow: false
            },
            {
              name: 'Status', id: 'status', visible: true,
              hideRow: false
            },
            {
              name: 'Population', id: 'population', visible: true,
              hideRow: false
            },
          ],
          rows: [
            {
              data: {
                hubId: 'HUB-ALPHA',
                location: 'Andromeda Station',
                status: 'Phase 3',
                population: '1.2M'
              },
              detailData: { // LEVEL 3 - 4 ROWS
                headers: [
                  {
                    name: 'Module ID', id: 'moduleId', visible: true,
                    hideRow: false
                  },
                  {
                    name: 'Module Type', id: 'type', visible: true,
                    hideRow: false
                  },
                  {
                    name: 'Gravity Control', id: 'gravity', visible: true,
                    hideRow: false
                  },
                  {
                    name: 'Oxygen Levels', id: 'oxygen', visible: true,
                    hideRow: false
                  },
                ],
                rows: [
                  {
                    data: {
                      moduleId: 'MOD-1A',
                      type: 'Residential',
                      gravity: '1.0G',
                      oxygen: '22%'
                    },
                    detailData: { // LEVEL 4 - 4 ROWS
                      headers: [
                        {
                          name: 'Floor ID', id: 'floorId', visible: true,
                          hideRow: false
                        },
                        {
                          name: 'Capacity', id: 'capacity', visible: true,
                          hideRow: false
                        },
                        {
                          name: 'Current Residents', id: 'residents', visible: true,
                          hideRow: false
                        },
                      ],
                      rows: [
                        {
                          data: {
                            floorId: 'FL-01',
                            capacity: '5000',
                            residents: '4873'
                          },
                          detailData: { // LEVEL 5 - 4 ROWS
                            headers: [
                              {
                                name: 'Unit ID', id: 'unitId', visible: true,
                                hideRow: false
                              },
                              {
                                name: 'Family Name', id: 'family', visible: true,
                                hideRow: false
                              },
                              {
                                name: 'Special Requirements', id: 'requirements', visible: true,
                                hideRow: false
                              },
                            ],
                            rows: [
                              { data: { unitId: 'UNIT-01', family: 'Zeta-9 Clan', requirements: 'Low-gravity adaptation' } },
                              { data: { unitId: 'UNIT-02', family: 'Voidborn Collective', requirements: 'Enhanced radiation shielding' } },
                              { data: { unitId: 'UNIT-03', family: 'Nebula Researchers', requirements: 'Lab integration' } },
                              { data: { unitId: 'UNIT-04', family: 'Transit Crew', requirements: 'Temporary lodging' } },
                            ]
                          }
                        }
                      ]
                    }
                  },
                  // 3 more LEVEL 3 rows
                  { data: { moduleId: 'MOD-1B', type: 'Agricultural', gravity: '0.8G', oxygen: '25%' }  },
                  { data: { moduleId: 'MOD-1C', type: 'Industrial', gravity: '1.2G', oxygen: '19%' }  },
                  { data: { moduleId: 'MOD-1D', type: 'Research', gravity: '1.0G', oxygen: '22%' }  },
                ]
              }
            },
            // 3 more LEVEL 2 rows
            { data: { hubId: 'HUB-BETA', location: 'Orion Ring', status: 'Phase 1', population: '0.2M' }},
            { data: { hubId: 'HUB-GAMMA', location: 'Pleiades Node', status: 'Phase 2', population: '0.8M' }},
            { data: { hubId: 'HUB-DELTA', location: 'Sirius Gateway', status: 'Planning', population: 'N/A' }},
          ]
        }
      },
     
    ]
  };

  ngOnInit(){
    syncHeadersRecursively(this.megaProjectData);
    this.megaProjectData.rows.push(this.megaProjectData.rows[0])
    this.megaProjectData.rows.push(this.megaProjectData.rows[0])
    this.megaProjectData.rows.push(this.megaProjectData.rows[0])
    this.megaProjectData.rows.push(this.megaProjectData.rows[0])
    this.tableSignal.set(this.megaProjectData);
  }
  bigSampleData(bigSampleData: any) {
    throw new Error('Method not implemented.');
  }
  // Create a signal from the large sample data
  tableSignal = signal<TableData>({} as TableData);
}
/* The helper functions */

function syncHeadersRecursively(tableData: TableData): void {
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
   
    if (parentHeaders.filter(p => p.visible).length > childHeaders.filter(p => p.visible).length ) {
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