import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ColumnSetting } from '../../data-models/layout.model';

@Component({
  selector: 'dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.css']
})
export class DynamicDataTableComponent implements OnChanges {
  @Input('records') records: any[];
  @Input('caption') caption: string;
  @Input('settings') settings: ColumnSetting[];
  @Input('tableViewId') tableViewId:string;
  
  columnMaps: ColumnSetting[]; 

  constructor() {

   }

  ngOnInit() {
    //window.dispatchEvent(new CustomEvent('table-manage-combine-ready'));
  }

  hasData()
  {
    
     return (this.records && this.records.length>0);
  }
  ngOnChanges(){
    if (this.settings) { // when settings provided
      this.columnMaps = this.settings;
    } else { 
      // no settings, create column maps with defaults
      if (!this.records || !this.records.length) return;
      this.columnMaps = [];
      Object.keys(this.records[0]).forEach(key => {
          if (key != '_id')
          {
            this.columnMaps.push({
              primaryKey: key,
              header: key.slice(0, 1).toUpperCase() + 
                 key.replace(/_/g, ' ' ).slice(1)
           })
          }
       }); 
    }
  }

  createDataTable()
  {

  }
}
