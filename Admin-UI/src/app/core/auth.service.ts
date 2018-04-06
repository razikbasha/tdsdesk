/**
 * Created by roxystimpsoniot on 2017-08-29.
 */
import { Injectable, OnInit, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';

import 'rxjs/add/operator/filter';
const auth0 = require('auth0-js');
import { environment } from '../../environments/environment';


import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AppRoutingModule } from '../app-routing.module';
import { APP_CONFIG, AppConfig } from '../app-config.module';
import { User } from '../data-models/user'
import { UsersService } from '../core/users.service';
import { Organization, Tenant, TenantConfig} from '../data-models/tenant';
import { OrganizationsService } from '../core/organizations.service';
import { TenantsService } from '../core/tenants.service';

@Injectable()
export class AuthService  {

    errorMessage:string;
    profileInfo: any;   
    userInfo:User;
    organizationInfo:any;
    tenantInfo:any;
    tenantConfig:TenantConfig;
    tenantsConfig:TenantConfig[];

    private sourceProfile  = new BehaviorSubject<any>('');
    currentProfile = this.sourceProfile.asObservable();
    changeProfile(profile:any){
       if (this.sourceProfile!=profile)
            this.sourceProfile.next(profile);
    }

    private sourceUser = new BehaviorSubject<User>(new User());   
    currentUser = this.sourceUser.asObservable();
    changeUser(user:any){
        if (this.sourceUser != user)
         this.sourceUser.next(user);
    }

    private sourceUsersOrganization = new BehaviorSubject<Organization> (new Organization());
    currentUsersOrganization = this.sourceUsersOrganization.asObservable();
    changeCurrentUsersOrganization(organization:Organization){
        this.sourceUsersOrganization.next(organization);
    }

    private sourceUsersTenant = new BehaviorSubject<Tenant> (new Tenant());
    currentUsersTenant = this.sourceUsersTenant.asObservable();
    changeCurrentUsersTenant(tenant:Tenant){
        this.sourceUsersTenant.next(tenant);
    }

    private sourceUsersTenantConfig = new BehaviorSubject<TenantConfig>(new TenantConfig());
    currentTenantConfig = this.sourceUsersTenantConfig.asObservable();
    changeCurrentTenantConfig(config:TenantConfig){
        this.sourceUsersTenantConfig.next(config);
    }


//using Auth0.com
CONNECTION_USERNAME_PASSWORD_AUTH = environment.auth.CONNECTION_USERNAME_PASSWORD_AUTH;

auth0 = new auth0.WebAuth({
    clientID: environment.auth.clientID,
    domain: environment.auth.domain,
    responseType: environment.auth.responseType,
    audience: environment.auth.audience,
    redirectUri: environment.auth.redirectUri,     
    scope: environment.auth.scope
  });
    

      constructor(public router: Router, 
                    private usersService:UsersService,
                    private organizationsService:OrganizationsService,
                    private tenantsService: TenantsService,
                    @Inject(APP_CONFIG) private config: AppConfig) {

        }
      
        public login(): void {
            this.auth0.authorize();
        }

  

        public handleAuthentication(): void {
            this.auth0.parseHash((err:any, authResult:any) => {

              if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.setCurrentUser(authResult);
                this.setCurrentProfile(authResult);
                this.router.navigate(['dashboard']);
              } else if (err) {
                    this.destroySession();
                    this.router.navigate(['dashboard']); //navigate to login screen

                    alert(`Error: ${err.error}. Check the console for further details.`);
              }
             else{
                  if (this.isAuthenticated())
                  {
                    //send  in a stored version of authResult
                    let localStorageAuthResult ={
                        accessToken: localStorage.getItem('access_token'),
                        idToken: localStorage.getItem('id_token'),
                        expiresAt: localStorage.getItem('expires_at'),
                        idTokenPayload:{
                            email: localStorage.getItem('email'),
                            name: localStorage.getItem('full_name'),
                            picture: localStorage.getItem('picture')

                        }
                        
                    }

                    this.setCurrentUser(localStorageAuthResult);
                    this.setCurrentProfile(localStorageAuthResult);

                    this.router.navigate(['dashboard']);
                }
                else
                {
                    this.router.navigate(['dashboard']);
                }
            }
            });
          }

          private setCurrentProfile (authResult:any):void{
              //if we don't store email & picture, we can pull this info from the api
              let profile = {
                email: authResult.idTokenPayload.email,
                name: authResult.idTokenPayload.full_name,
                picture: authResult.idTokenPayload.picture
              };

             if (authResult.accessToken)
             {
                    const self = this;
                this.auth0.client.userInfo(authResult.accessToken, (err:any, userProfile:any)=>{
                
                    if (userProfile){
                        self.profileInfo = userProfile;
                        profile.email = userProfile.email;
                        profile.picture = userProfile.picture;
                        this.changeProfile(profile);
                    }
                    else if (err)
                    {
                        //token is no longer valid, try to login again
                        // console.log('get user prfile error: ' + JSON.stringify(err));
                        alert('get user profile error: ' + JSON.stringify(err));
                    } 

            
                });
            }
            else //we should not get here!!!
            {
                console.log('no user profile');
            }
          }

        private setCurrentUser (authResult:any):void {
            
            if (authResult.accessToken)
            {
                
                    this.usersService.getUserById('&name=email_address&value=' +authResult.idTokenPayload.email)
                        .subscribe(data => {
                            if (data && data['results'] && data['results'].length>0)
                            {
                                let results = data['results'];
                                let userDocFromDB = data['results'][results.length-1];
                                let userInfo = this.usersService.validateUserSchema(userDocFromDB);
                                this.changeUser(userInfo);

                            }
                            else
                            {
                                let userInfo = new User();
                                userInfo.full_name = '';
                                userInfo.security_role = '';
                                this.changeUser(userInfo);
                            }
                   });
            }
        }
        
        private setCurrentUsersOrganization():void{
            
            this.currentUser.subscribe(user =>{
                if (user.organization)
                {
                    this.organizationsService.getOrganizationById('&name=name&value='+ user.organization.id)
                        .subscribe( data => {
                        if (data && data['results'] && data['results'].length>0)
                        {
                            let results = data['results']
                            let organizationDocFromDB = data['results'][results.length-1];
                            this.organizationInfo = this.organizationsService.validateOrganizationSchema(organizationDocFromDB);
                        }
                        else
                        {
                            this.organizationInfo = new Organization(); 
                            this.organizationInfo.name = 'D4DT'; // for demo & trial only
                            this.organizationInfo.domain_name = 'www.d4dt.com';
                        }
                        this.changeCurrentUsersOrganization(this.organizationInfo);
                    })
                }
                else
                {
                    this.organizationInfo = new Organization();
                    this.organizationInfo.name = 'D4DT'; // for demo & trial only
                    this.organizationInfo.domain_name = 'www.d4dt.com';
                    this.changeCurrentUsersOrganization(this.organizationInfo);
                }
            })
        }

        private setCurrentUsersTenant():void{
            
            this.currentUser.subscribe(user =>{
                if (user.tenant)
                {
                    this.tenantsService.getTenants('&name=id&value='+ user.tenant.id)
                    
                    .subscribe( data => {
                        if (data && data['results'] && data['results'].length>0)
                        {
                            let results = data['results']
                            let tenantDocFromDB = data['results'][results.length-1];
                            this.tenantInfo = this.tenantsService.validateTenantSchema(tenantDocFromDB);
                        }
                        else
                        {
                            this.tenantInfo = new Tenant();
                            this.tenantInfo.id = '';
                        }
                        this.changeCurrentUsersTenant(this.tenantInfo);
                    })
                }
                else
                    {
                        this.tenantInfo = new Tenant();
                        this.tenantInfo.id = '';
                        this.changeCurrentUsersTenant(this.tenantInfo);
                    }
            })
        }

        private setSession(authResult:any): void {
                // Set the time that the access token will expire at
                const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('expires_at', expiresAt);


                localStorage.setItem('full_name', authResult.idTokenPayload.name);
                localStorage.setItem('picture', authResult.idTokenPayload.picture);
                localStorage.setItem('email', authResult.idTokenPayload.email);
          }

        private setSessionUserInfo(userInfo:User):void{
            if (localStorage.getItem('email') == userInfo.id)
            {
                localStorage.setItem('organization_id', userInfo.organization.id);
                localStorage.setItem('organization_name',userInfo.organization.name);
                localStorage.setItem('tenant_id',userInfo.tenant.id);
                localStorage.setItem('tenant_name',userInfo.tenant.name);
            }
        }
        
        public logout(): void {
        
            this.destroySession();
            // reset currentUser &
            this.changeProfile('');
            this.changeUser(new User());

            //reset currentProfile

            // Go back to the home route
            this.router.navigate(['dashboard']);
        }

        private destroySession():void {
            // Remove tokens and expiry time from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('full_name');
            localStorage.removeItem('picture');
            localStorage.removeItem('email');

            localStorage.removeItem('organization_id');
            localStorage.removeItem('organization_name');
            localStorage.removeItem('tenant_id');
            localStorage.removeItem('tenant_name');

        }
    
        public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return  new Date().getTime() < expiresAt;
        }
        

        public getToken(): string {
            return localStorage.getItem('access_token');
        }

        public getUserId(): string {
            return localStorage.getItem('email');
        }

        public getCurrentTenantId(): string {
            return (localStorage.getItem('tenant_id'));
        }
        public getCurrentUserTenantName(): string {
            
            return (localStorage.getItem('tenant_name'));
        }

        public getCurrentOrganizationId(): string{
            return (localStorage.getItem('organization_id'));
        }
        public getCurrentOrganizationName(): string{
            return (localStorage.getItem('organization_name'));
        }
    
    ngOnInit(): void {       
    
    }

    cachedRequests: Array<HttpRequest<any>> = [];
    public collectFailedRequest(request:HttpRequest<any>): void {
        this.cachedRequests.push(request);
      }
    public retryFailedRequests(): void {
        // retry the requests. this method can
        // be called after the token is refreshed
      }
    
    
    
}
