import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Organization, Tenant, TenantConfig } from '../data-models/tenant'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';

@Injectable()
export class TenantsService {
    
    tenants: Observable<any>;
    currentDate = new Date();

    private apiUri = environment.apiEndpoint;
    private tenantsEndpoint = this.apiUri + '&a=find&ot=Tenant';
    private tenantAddEndpoint = this.apiUri + '&a=add&ot=Tenant';
    private tenantUpdateEndpoint = this.apiUri + '&a=update&ot=Tenant';
    private tenantsCountEndpoint = this.apiUri + '&a=count&ot=Tenant';
    private tenantConfigEndpoint = environment.configEndpoint + '&a=find&ot=TenantConfig';
    
    constructor(private http: HttpClient) {
    }
    
    ngOnInit(): void {
    }
    
    
    getTenantConfig(params: string): Observable<TenantConfig[]> {
        return this.http.get<TenantConfig[]>(this.tenantConfigEndpoint + params)
        .catch(this.handleError);
    }

    getTenants(params: string): Observable<Tenant[]> {
        
        return this.http.get<Tenant[]>(this.tenantsEndpoint + params)
            //.do (data =>console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }

    
    getCountWithParams(params: string): Observable<any[]> {
        
        return this.http.get<any[]>(this.tenantsCountEndpoint + params)
            //.do (data =>console.log(JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    getTenantById(params: string): Observable<Tenant[]> {
        
        return this.http
            .get<Tenant[]>(this.tenantsEndpoint + params)
            .catch(this.handleError);
    }
    
    saveTenant(saveDoc: any, action:string) {
        let actionEndPoint = this.tenantAddEndpoint;
        let updateIdParam = '';
        //commented out until Vishal figure out the update in the back-end
        if (action == 'edit')
        {
            actionEndPoint = this.tenantUpdateEndpoint;
            updateIdParam = '{\"id\":\"' +  saveDoc.id + '\"},';
            
        } 
        return this.http
            .post(actionEndPoint, updateIdParam + saveDoc.jsonBody)
            .subscribe(data => {
                if (data['nInserted'] && data['nInserted'] === 1) {
                 //   console.log('Successful updated Tenant ID ' + saveDoc.tenantId);
                }
                else {
                  //  console.log('Unable to save Tenant ID ' + saveDoc.tenantId);
                }
            })
    }

    validateTenantSchema(tenantDocFromDB: any) {
        return {
            id:                 tenantDocFromDB.id || tenantDocFromDB.name || '',
            name:               tenantDocFromDB.name || '',
            friendly_name:      tenantDocFromDB.friendly_name || '',
            details:{
                tenant_type:        tenantDocFromDB.details.tenant_type || '',
                industry_template:  tenantDocFromDB.details.industry_template || '',
                organization:       tenantDocFromDB.details.organization || '',
                industry:           tenantDocFromDB.details.industry || '',
                domain:             tenantDocFromDB.details.domain || '',
                billing_frequency:  tenantDocFromDB.details.billing_frequency || '',
                subscription:       tenantDocFromDB.details.subscription || '',
                billing_contacts:   tenantDocFromDB.details.billing_contacts || '',
                tenant_admins:      tenantDocFromDB.details.tenant_admins || '',
                device_models:      tenantDocFromDB.details.device_models || '',
                use_cases:          tenantDocFromDB.details.use_cases || '',
            },
            branding:
            {
                branding_logo:
                {
                    id: (tenantDocFromDB.branding.branding_logo)? tenantDocFromDB.branding.branding_logo.id : '',
                    path: (tenantDocFromDB.branding.branding_logo)? tenantDocFromDB.branding.branding_logo.path : '',
                },
                landing_page_logo:
                {
                    id: (tenantDocFromDB.branding.landing_page_logo)? tenantDocFromDB.branding.landing_page_logo.id : '',
                    path: (tenantDocFromDB.branding.landing_page_logo)? tenantDocFromDB.branding.landing_page_logo.path :'',
                },
                dashboard_logo:
                {
                    id: (tenantDocFromDB.branding.dashboard_logo)? tenantDocFromDB.branding.dashboard_logo.id : '',
                    path: (tenantDocFromDB.branding.dashboard_logo)? tenantDocFromDB.branding.dashboard_logo.path : '',
                },
                login_page_logo:
                {
                    id: (tenantDocFromDB.branding.login_page_logo)? tenantDocFromDB.branding.login_page_logo.id : '',
                    path: (tenantDocFromDB.branding.login_page_logo)? tenantDocFromDB.branding.login_page_logo.path : '',
                },
                landing_background_logo:
                {
                    id: (tenantDocFromDB.branding.landing_background_logo)? tenantDocFromDB.branding.landing_background_logo.id : '',
                    path: (tenantDocFromDB.branding.landing_background_logo)? tenantDocFromDB.branding.landing_background_logo.path : '',
                },
                theme_color:    tenantDocFromDB.branding.theme_color || '',
                font_family:    tenantDocFromDB.branding.font_family || '',
                notes:          tenantDocFromDB.branding.notes || '',
                copyright_message:  tenantDocFromDB.branding.copyright_message || '',

            },
            permissions:    tenantDocFromDB.permissions || '',
            time_created:       tenantDocFromDB.time_created || this.currentDate,
            time_updated:       tenantDocFromDB.time_updated || this.currentDate,
            created_by:         tenantDocFromDB.created_by || '',
            updated_by:         tenantDocFromDB.updated_by || ''

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
