import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Dashboard,DashboardDataSchema } from '../data-models/dashboard'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';

@Injectable()
export class DashboardService implements OnInit {
    
    dashboards: Observable<any>;
    private dashboardEndpoint =  environment.apiEndpoint + '&a=find&ot=Dashboard';
    

    constructor(private http: HttpClient) {
    }
    
    ngOnInit(): void {
        
    }
    
    
    
    /*****
     * GET Dashboards
     ************************************/
    getDashboards(): Observable<Dashboard[]> {
        //-- Make the HTTP request
        
        return this.http.get<Dashboard[]>(this.dashboardEndpoint)
           // .do (data =>console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }

    /***
     * GET Dashboard
     */
    getDashboardSeriesById(id:string): Observable<DashboardDataSchema[]>{
        return this.http.get<DashboardDataSchema[]>(this.dashboardEndpoint+'.HCData' +'&name=id&value=' + id)
        .do(data=>console.log(JSON.stringify(data)))
        .catch(this.handleError);
    }
    
    /**
     * Get & Show specific dashboard
     */
    getDashboardHCDeviceDataById(id:string):Observable<Dashboard[]>{
        return this.http.get<Dashboard[]>(this.dashboardEndpoint+'&name=id&value=' + id)
        //.do (data => console.log(JSON.stringify(data)))
        .catch(this.handleError);    
    }
    
    /*****
     * Common Function: HandleError
     ************************************/
    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}
