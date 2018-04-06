import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRequestComponent } from './report-request/report-request.component';
import { ReportResultsRawComponent } from './report-results-raw/report-results-raw.component';
import { ReportResultsHchartComponent } from './report-results-hchart/report-results-hchart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ReportRequestComponent,
    ReportResultsRawComponent,
    ReportResultsHchartComponent
  ],
  exports:[
    ReportRequestComponent, 
    ReportResultsRawComponent,
    ReportResultsHchartComponent   
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[]
})
export class ReportsModule { }
