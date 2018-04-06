import { Component, OnInit,Input, ViewChild, 
    AfterViewInit, OnDestroy,
    ComponentFactoryResolver } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { User } from '../../data-models/user';
import { DynamicChartComponent } from '../../shared/dynamic-chart/dynamic-chart.component';
import { Highcharts } from 'angular-highcharts';
import { ReportService } from '../../core/report.service';
import { ReportRequest, ReportDataSchema } from 'app/data-models/report';
import { getCurves } from 'crypto';
import { Jsonp } from '@angular/http/src/http';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { JsonPipe } from '@angular/common/src/pipes/json_pipe';
import { AfterContentChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { DynamicDataTableComponent } from '../../shared/dynamic-data-table/dynamic-data-table.component';

@Component({
  selector: 'report-results-raw',
  templateUrl: './report-results-raw.component.html',
  styleUrls: ['./report-results-raw.component.css']
})
export class ReportResultsRawComponent implements OnInit, AfterViewInit,OnDestroy {
  @Input('reportRequest') reportRequest: ReportRequest;
  @Input('caption') reportTitle: string;
  @Input('tableViewId') tableViewId:string;

  @ViewChild(DynamicDataTableComponent) dynamicDataTable:DynamicDataTableComponent;

    errorMessage:string;
    options:Object;
    reportDataMax:any[] = new Array<any>();
    reportDataMin:any[] = new Array<any>();
    reportDataMean: any[] = new Array<any>();
    reportDataMedian:any[] = new Array<any>();
    reportDataStd: any[] = new Array<any>();
    reportData: any[] = new Array<any>();


  constructor(private reportService:ReportService, 
                private componentFactoryResolver:ComponentFactoryResolver) { 
    
  }

  ngAfterViewInit()
  {
        this.loadDynamicTable();
  }

  ngOnDestroy(){
    this.clearDynamicTable();
  }

  loadDynamicTable(){
  }

  clearDynamicTable(){}

  ngOnInit() {  
      if (!this.reportRequest.data_source) this.reportRequest.data_source = 'Select ...';
      this.getResults();
  }

  getResults()
  {
      if (this.reportRequest.data_source == 'Select...')
        {
                this.getResultsForBS();
                return;
        }
        this.reportService.getReportResultsRaw(this.reportRequest)
            .subscribe(data => {
                let rptData = data['results'];
                this.reportData = rptData;
            })    
      
  }
  
  getResultsForBS()
  {
      //Handle special case for BS
      this.reportService.getReportResultsRaw(this.reportRequest)
          .subscribe(data =>  {
              let count = data['results'].length;
              console.log(count);
              let i = 0;
              let rdMax = new Array<any>();
              let rdMin= new Array<any>();
              let rdMean = new Array<any>();
              let rdMedian = new Array<any>();
              let rdStd = new Array<any>();
              while(i< count)
              {
                  rdMax.push(data['results'][i]['max']);
                  rdMin.push(data['results'][i]['min']);
                  rdMean.push(data['results'][i]['mean']);
                  rdMedian.push(data['results'][i]['median']);
                  rdStd.push(data['results'][i]['std']);
                  i = i + 1;
              }
              this.reportDataMax = rdMax; 
              this.reportDataMin = rdMin;
              this.reportDataMean = rdMean;
              this.reportDataMedian = rdMedian;
              this.reportDataStd = rdStd;

              let matrix:string;
              !this.reportRequest.matrix_calculator? matrix = 'min': matrix = this.reportRequest.matrix_calculator[0].matrix_type;
              switch (matrix ) {
                  case 'max':
                      this.reportData = this.reportDataMax;
                      break;
                  case 'min':
                  this.reportData = this.reportDataMin;
                  break;
                  case 'mean':
                  this.reportData = this.reportDataMean;
                  break;
                  case 'median':
                  this.reportData = this.reportDataMedian;
                  break;
                  case 'std':
                  this.reportData = this.reportDataStd;
                  break;
                  default:
                    this.reportData = this.reportDataMin;
                      break;
              }
              
          })   
      
  }

}
