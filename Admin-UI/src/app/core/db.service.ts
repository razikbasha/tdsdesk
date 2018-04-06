import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';


import { environment } from '../../environments/environment';
//-- Data Models
import { Constants } from '../data-models/common';
import { DeviceDocuments, DeviceModel, DeviceType } from '../data-models/device';

//-- Services


@Injectable()
export class DBService implements OnInit {
    
    private apiUri = environment.apiEndpoint;
    constructor(private httpClient: HttpClient, private requestOptions: RequestOptions) {
        
    }
    
    ngOnInit(): void {
    }

 getRequest(params:string, action:string, jsonBody:any):Observable<any[]> {       
        return this.httpClient
        .get<any[]>(this.apiUri + params)
        .catch(this.handleError);
    }

postRequest(action:string, params:string, saveDoc: any) {
        let endpoint='';
        
        let updateIdParam = '';
        
        if (action == 'edit') //add this so that API know which record to delete first
        {
            updateIdParam = '{\"id\":\"' +  saveDoc.id + '\"},';
            endpoint = endpoint.replace('add','update');
            
        }    
        
        return this.httpClient
            .post(endpoint, updateIdParam + saveDoc.jsonBody)
            .catch(this.handleError)
            .subscribe(data => {
                if (data['nInserted'] && data['nInserted'] === 1 && action == 'new') {
                    console.log('Successful saved ' + saveDoc.objectType + ' ID ' + saveDoc.id);
                } else if (data['nModified'] && data['nModified'] === 1 && action == 'edit') {
                    console.log('Successful saved ' + saveDoc.objectType + ' ID ' + saveDoc.id); 
                }
                else {
                    console.log('Unable to save ' + saveDoc.objectType + ' ID ' + saveDoc.id);
                }
            });
            
    }

    /*****
     * Common Function: HandleError
     ************************************/
    private handleError(err: HttpErrorResponse) {
        return Observable.throw(err.message);
    }
}

