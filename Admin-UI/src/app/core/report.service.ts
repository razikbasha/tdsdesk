import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ReportRequest,
      ReportResultsInHighChart, 
      ReportDataSchema, 
      ReportResultsInGrid,
      ReportKPI }  from '../data-models/report';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';
import { ColumnSetting } from '../data-models/layout.model';

@Injectable()
export class ReportService {

    
  dashboards: Observable<any>;
  private reportEndpoint =  environment.apiEndpoint + '&a=find&ot=Dashboard';
  private reportEndPointForRawData = environment.apiEndpoint + '&a=find&ot=';
  private reportKPIEndPoint = environment.apiEndpoint + '&a=find&ot=TenantKPI&name=tenant_id&value='
  
  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
      
  }

  getReportKPIByTenantId(tenantId:string):Observable<ReportKPI[]>
  {
    return  this.http.get<ReportKPI[]>(this.reportKPIEndPoint + tenantId)
        .do(data=> console.log(JSON.stringify(data)))
        .catch(this.handleError);
  }
  
  getReportResultsRaw(reportRequest:ReportRequest): Observable<any[]> {
    return this.http.get<any[]>(this.reportEndPointForRawData + reportRequest.data_source)
       // .do (data =>console.log(JSON.stringify(data)))
        .catch(this.handleError);
}
  
  getReportResultsInHChart(reportRequest:ReportRequest): Observable<ReportResultsInHighChart[]> {
      console.log('reportRequest:' + JSON.stringify(reportRequest));
      return this.http.get<ReportResultsInHighChart[]>(this.reportEndpoint)
         // .do (data =>console.log(JSON.stringify(data)))
          .catch(this.handleError);
  }

  getDashboardSeriesById(id:string): Observable<ReportDataSchema[]>{
      return this.http.get<ReportDataSchema[]>(this.reportEndpoint+'.HCData' +'&name=id&value=' + id)
      .do(data=>console.log(JSON.stringify(data)))
      .catch(this.handleError);
  }


  getDataTableColumnMaps(records:any[]):any[]
  {     
      if (!records || !records.length) return;
      return  Object.keys(records[0])
          .map( key => {
               return {
                   primaryKey: key,
                   header: key.slice(0, 1).toUpperCase() + 
                      key.replace(/_/g, ' ' ).slice(1)
          }
      });
  }

    /*****
     * Common Function: HandleError
     ************************************/
    private handleError(err: HttpErrorResponse) {
      console.log(err.message);
      return Observable.throw(err.message);
  }
}
