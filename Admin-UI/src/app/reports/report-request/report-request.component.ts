import { NgModule} from '@angular/core';
import { Component, OnChanges, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth.service';
import { ReportRequest } from '../../data-models/report';
import { ReportService } from 'app/core/report.service';
import { ColumnSetting } from 'app/data-models/layout.model';

@Component({
  selector: 'report-request-component',
  templateUrl: './report-request.component.html',
  styleUrls: ['./report-request.component.css']
})
export class ReportRequestComponent implements OnInit {
  @Output() onSubmitReportRequest: EventEmitter<any> = new EventEmitter<any>();

jsonBody = {};
results:any;
errorMessage:'';
params:string[];
listOfDataSources: string[];
listOfMatrixes:string[];
listOfFrequencies:string[];
listOfReportTypes:string[];
listOfReportableColumnMaps: ColumnSetting[];
isDateRange:boolean = false;

public reportRequest:ReportRequest;

//-- Reactive Form
reportRequestForm = new FormGroup({});
//-- Lookups

  constructor(private fb:FormBuilder, public authService: AuthService, private reportService:ReportService) { }

  ngOnInit() {

    this.getAvailableReportParamList();
    this.createForm();
    this.reportRequest = new ReportRequest();
    this.onChange();

  }


  createForm()
  {
    //-- Reactive Form
    this.reportRequestForm = this.fb.group({
      reportDataSource: new FormControl(),
      reportStartDate: new FormControl(),
      reportEndDate: new FormControl(),
      reportFrequency: new FormControl(),
      reportMatrix: new FormControl(),
      reportType: new FormControl(),
      reportableColumn: new FormControl(),
      
    });
  }

    setReportStartDate(): void {
      let date = new Date();
      this.reportRequestForm.patchValue({
        reportStartDate: {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate()
            }
        }
      });
    }

    clearReportStartDate(): void {
        this.reportRequestForm.patchValue({reportStartDate: null });
    }

  getAvailableReportParamList()
  {
     this.listOfDataSources = [ 'T_heromotocorp_iirp.DMTable_hero_sm_honn_mtl', 'T_heromotocorp_iirp.DMTable_hero_sm_honn',
                'T_heromotocorp_iirp.DMTable_hero_sm_fb', 'T_heromotocorp_iirp.DMTable_hero_sm_fb_mtl',
                'T_heromotocorp_iirp.DMTable_hero_sm_frd', 'T_heromotocorp_iirp.DMTable_hero_sm_frd_mtl',
              //  'T_heromotocorp_iirp.DMTable_hero_sm_cmm','T_heromotocorp_iirp.DMTable_hero_sm_cmm_mtl'
               ];
     this.listOfMatrixes = [
       'none','min', 'max', 'med', 'mean','std'
     ];
     this.listOfFrequencies = ['Monthly'] //['Yearly', 'Quarterly','Monthly']; //['Yearly', 'Quarterly','Monthly','Weekly','Daily'];
     this.listOfReportTypes = ['raw'] //, 'line', 'column', 'bar', 'areaspline'];
  }

  setAvailableReportParamList(reportParams:string[])
  {
      this.listOfDataSources = reportParams;
  }

  setAvailableReportTypes(reportTypeParams:string[])
  {
    this.listOfReportTypes = reportTypeParams;
  }
  onChange()
  {
      this.reportRequestForm.get('reportDataSource').valueChanges.subscribe( val => {
            this.getReportableColumns(val);
      });

      this.reportRequestForm.get('reportFrequency').valueChanges.subscribe( val => {
          this.isDateRange = (val  == 'Date Range');
      })
  }

   getReportableColumns(dataSource:string)
   {
       let rr = new ReportRequest();
       rr.data_source = dataSource;
        this.reportService.getReportResultsRaw(rr)
          .subscribe(data => {
              let records = data['results'];
              this.listOfReportableColumnMaps = this.reportService.getDataTableColumnMaps(records);
          })
   }  

   onGenerateReport()
   {
     const updatedFormValues = this.reportRequestForm.value;
     let rrBody:ReportRequest = {
       data_source: updatedFormValues.reportDataSource,
       date_range: {
           start_date_time: updatedFormValues.reportStartDate,
           end_date_time: updatedFormValues.reportEndDate,
       },
       frequency: updatedFormValues.reportFrequency, //Yearly, Quarterly/Monthly/Weekly/Daily/Hourly/Minute/Second/Rolling12Months
       columns:[{name: updatedFormValues.reportableColumn? updatedFormValues.reportableColumn.primaryKey:'',
                 header:updatedFormValues.reportableColumn? updatedFormValues.reportableColumn.header:'', 
                 position:0}],
       matrix_calculator:[{
           name:updatedFormValues.reportMatrix,
           matrix_type:updatedFormValues.reportMatrix,
           columns:[{name:updatedFormValues.reportableColumn? updatedFormValues.reportableColumn.primaryKey:''}],
       }],
       result_format:{
           name:updatedFormValues.reportType, //csv, raw, grid, higchart,highstock,map
           chart_type: updatedFormValues.reportType, //line, gauge, map
           data_table_view_id: ''
       }    

     };
     this.reportRequest = rrBody;

    this.onSubmitReportRequest.emit(this.reportRequest);
   }
}
