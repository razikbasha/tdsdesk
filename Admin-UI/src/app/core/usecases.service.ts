
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
//-- Data Models
import { Constants } from '../data-models/common';
import { Usecase, UsecaseSchema } from '../data-models/usecase';
import { UseCaseType } from '../data-models/common';


@Injectable()
export class UsecasesService implements OnInit {
    
    usecases: Observable<any>;
    private apiURI = environment.apiEndpoint;
    getUsecaseEndpoint = this.apiURI + '&a=find&ot=UseCase';
    postUsecaseEndpoint = this.apiURI + '&a=add&ot=UseCase';
    getUsecaseCountEndpoint = this.apiURI + '&a=count&ot=UseCase';
    getUsecaseTypeEndpoint = this.apiURI + '&a=find&ot=UseCaseTypeByIndustry';
    
    currentDate = new Date();
    headers = new HttpHeaders({'Content-Type': 'application/json'});

    //-- Sub-Documents
    usecaseCollaboratorsDefault = {email_address:  '', full_name: ''};
    usecaseDocumentsDefault = {id: '', filename: '', path: '',};
    usecaseDevicesDefault = {
        device_id: '',
        device_name: '',
        device_type: '',
        device_model: '',
        sensors_per_device: '',
        number_of_devices: '',
        location: '',
        device_tag_frequency: {
            value: '',
            unit: '',
        },
        device_packet_size: {
            value: '',
            unit: '',
        },
        data_format: '',
        data_interface: '',
    };
    
    //-- Inject HttpClient into your component or service
    constructor(private httpClient: HttpClient) {
    }
    
    ngOnInit(): void {}
    
    
    
    /*****
     * GET Total Number of Use Cases
     ************************************/
    getCountWithParams(params: string): Observable<any[]> {
        
        return this.httpClient.get<any[]>(this.getUsecaseCountEndpoint + params)
            //.do (data =>console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    /*****
     * GET Usecases
     ************************************/
    getUsecases(params: string): Observable<Usecase[]> {
        
        return this.httpClient
            .get<Usecase[]>(this.getUsecaseEndpoint + params)
            //.do (data =>console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    /*****
     * GET Usecase By ID
     ************************************/
    getUsecaseById(params: string): Observable<Usecase[]> {
        return this.httpClient
            .get<Usecase[]>(this.getUsecaseEndpoint + params)
            .catch(this.handleError);
    }
    
    /*****
     * GET Usecase Templates
     ************************************/
    getUsecaseTemplates(params:string): Observable<any[]> {
        
        return this.httpClient
            .get<Usecase[]>(this.getUsecaseEndpoint+params)
            .catch(this.handleError);
    }

    /*****
     * GET Usecase Types
     ************************************/
    getUsecaseTypes(params:string): Observable<any[]> {
       
        return this.httpClient
            .get<UseCaseType[]>(this.getUsecaseTypeEndpoint+params)
            .catch(this.handleError);
    }
    
    /*****
     * Save / Update Usecase
     ************************************/
    saveNewOrUpdatedUsecase(saveDoc: any, action:string) {
        //-- Make the HTTP request via Usecase.Service
        let actionEndPoint = this.postUsecaseEndpoint;
        
        let updateIdParam = '';
        //commented out until Vishal figure out the update in the back-end
        if (action == 'edit')
        {
            actionEndPoint = actionEndPoint.replace('add','update');
            updateIdParam = '{\"id\":\"' +  saveDoc.id + '\"},';
            
        }    
        return this.httpClient
            .post(actionEndPoint, updateIdParam + saveDoc.jsonBody)
            .subscribe(data => {
                if (data['nInserted'] && data['nInserted'] === 1) {
                   // console.log('Successful updated Usecase ID ' + saveDoc.id);
                } else {
                   // console.log('Unable to save Usecase ID ' + saveDoc.id);
                }
            })
    }
    
    validateUsecaseSchema(usecaseDocFromDB: any) {
        return {
            id:                 usecaseDocFromDB.id || '',
            name:               usecaseDocFromDB.name || usecaseDocFromDB.id || '',
            friendly_name:      usecaseDocFromDB.friendly_name || '',
            usecase_status:     usecaseDocFromDB.usecase_status || '',
            industry:           usecaseDocFromDB.industry || '',
            usecase_template:   usecaseDocFromDB.usecase_template || '',
            usecase_tenant:     usecaseDocFromDB.usecase_tenant || '',
            usecase_type:       usecaseDocFromDB.usecase_type || '',
            description:        usecaseDocFromDB.description || '',
            
            user_info: {
                user_hierarchy:                     (usecaseDocFromDB.user_info && usecaseDocFromDB.user_info.user_hierarchy)? usecaseDocFromDB.user_info.user_hierarchy : '',
                change_role_functionality:          (usecaseDocFromDB.user_info && usecaseDocFromDB.user_info.change_role_functionality)? usecaseDocFromDB.user_info.change_role_functionality : '',
                user_unsubscribe:                   (usecaseDocFromDB.user_info && usecaseDocFromDB.user_info.user_unsubscribe)? usecaseDocFromDB.user_info.user_unsubscribe : '',
                is_user_invite_feature_included:    (usecaseDocFromDB.user_info && usecaseDocFromDB.user_info.is_user_invite_feature_included)? usecaseDocFromDB.user_info.is_user_invite_feature_included : true
            },
            collaborators: usecaseDocFromDB.collaborators,
            files: {
                usecase_icon: {
                    //-- Temporary; must be UUID.v4()
                    id:         (usecaseDocFromDB.files && usecaseDocFromDB.files.usecase_icon && usecaseDocFromDB.files.usecase_icon.id)? usecaseDocFromDB.files.usecase_icon.id : '',
                    path:       (usecaseDocFromDB.files && usecaseDocFromDB.files.usecase_icon && usecaseDocFromDB.files.usecase_icon.path)? usecaseDocFromDB.files.usecase_icon.path : ''
                },
                usecase_documents: usecaseDocFromDB.usecase_documents,
                
            },
            devices: usecaseDocFromDB.devices,
            created_time:       usecaseDocFromDB.created_time || this.currentDate,
            created_by:         usecaseDocFromDB.created_by || '',
            time_updated:       usecaseDocFromDB.time_updated || this.currentDate,
            updated_by:        usecaseDocFromDB.updated_by || '',
            
        };
    }
    
    /*****
     * Common Function: HandleError
     ************************************/
    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
    
}