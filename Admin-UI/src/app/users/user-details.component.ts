import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSchema } from '../data-models/user';
import { UserPrefixes, UserSuffixes, CommonLookups, Countries, StatesOrProvincesPerCountry } from '../data-models/common';
import { SecurityRoles } from '../data-models/security-role';
import { Organization,Tenant } from '../data-models/tenant';
import { User, UserGroup  } from '../data-models/user';
import { UsersService } from '../core/users.service';
import { OrganizationsService } from '../core/organizations.service';
import { TenantsService } from '../core/tenants.service';
import { CommonService }    from '../core/common.service';
import { AuthService } from '../core/auth.service';
import { AppComponent } from '../app.component';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent implements OnInit {
    // current login user 
    currentUser:User = new User();


    jsonBody = {};
    
    user: any;
    isReadOnly:boolean;

    errorMessage: string;
    path: any;
    id: string;
    paramKey: any;
    currentDate = new Date();
    
    //-- Lookups
    organizations: Organization[];
    tenants: Tenant[];
    tenantList: Tenant[];
    userGroups: UserGroup[];
    listOfUserGroups: UserGroup[];
    allSercurityRoles = SecurityRoles;
    listOfSercurityRoles = SecurityRoles;
    listOfUserPrefixes = UserPrefixes;
    listOfUserSuffixes = UserSuffixes;

    countries = this.commonService.getCountryList();
    statesOrProvincesPerCountry = this.commonService.getStateByCountry('United States');
    
    constructor(private fb: FormBuilder,
                private organizationsService: OrganizationsService,
                private tenantsService: TenantsService,
                private route: ActivatedRoute,
                private router: Router,
                private usersService: UsersService,
                private app:AppComponent,
                private authService: AuthService,
                private commonService:CommonService) {
        //-- app.setPageContentFullWidth(false);
    }
    

    //-- Reactive Form
    userDetailsForm = new FormGroup({});
    
    ngOnInit(): void {
        

        this.paramKey = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    
        this.path = this.route.snapshot.url[1]? this.route.snapshot.url[1].toString() : this.id;
        
        this.jsonBody = JSON.stringify({id: this.id});
        const params = '&name=id&value=' + this.id;
        
        if (!this.authService.isAuthenticated()) this.router.navigate(['login']);
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            let filters:string = '';

            if (this.isSuperAdmin())
            {
                this.getOrganizationList('');
                this.getTenantList('');
                this.getUserGroupList('');
            }
            else 
            {
                this.getOrganizationList('&name=id&value=' + this.currentUser.organization.id);
                this.getTenantList('&name=id&value=' + this.currentUser.tenant.id);    
                this.getUserGroupList('&name=organization&value=' +this.currentUser.organization.id);

                this.listOfSercurityRoles =  this.allSercurityRoles.filter( role=> {
                  return (!role.includes("Super Admin"))
              });
            }

        });

        if (this.id)
            this.getUserById(params);

        this.createFormDefault();
        this.countryOnChanges();
        this.organizationOnChanges();

        if ((this.path === 'edit') || (this.path === 'new'))
            this.isReadOnly = false;
        else    
            this.isReadOnly = true;

    }

    isSuperAdmin():boolean{
        return this.currentUser.security_role == 'Super Admin';
    }

    countryOnChanges()
    {
        this.userDetailsForm.get('userCountry').valueChanges.subscribe(val =>{
            this.statesOrProvincesPerCountry = this.commonService.getStateByCountry(val);
        });
    }

    organizationOnChanges()
    {
         this.userDetailsForm.get('userOrganization').valueChanges.subscribe(val => {
            if (this.tenantList && this.tenantList.length>0)
            {
                this.tenants = this.tenantList.filter(t => {
                    return t.details.organization.toLowerCase() == val.toLowerCase();
                });
            }
        });
    }
    getOrganizationList(params:string) {
        this.organizationsService.getOrganizations(params)
            .subscribe(data => {
                    let listOfOrganizations = data['results'];
                    this.organizations = listOfOrganizations;
                },
                error => this.errorMessage = <any>error);
        
    }

    getTenantList(params:string) {
        this.tenantsService.getTenants(params)
            .subscribe(data => {
                    let listOfTenants = data['results'];
                    this.tenantList = listOfTenants;
                    this.tenants = this.tenantList;
                },
                error => this.errorMessage = <any>error);
        
    }
    

    /**
     * User Methods
     ****************/

    cancelEditUser() {
        this.router.navigate(['users/' + this.id]);
    }
    
    closeEditUser() {
        this.router.navigate(['users']);
    }
    
    createFormDefault() {
    
        this.userDetailsForm = this.fb.group({
            userPrefix:         new FormControl(),
            fullName:           new FormControl(),
            nickName:           new FormControl(),
            userSuffix:         new FormControl(),
            userOrganization:   new FormControl(),
            userTenant:         new FormControl(),
            userJobTitle:       new FormControl(),
            userEmailAddress:   new FormControl(),
            userMainContact:    new FormControl(),
            userPhoneNumber:    new FormControl(),
            userMobileNumber:   new FormControl(),
            userAddress1:       new FormControl(),
            userAddress2:       new FormControl(),
            userCity:           new FormControl(),
            userPostalCode:     new FormControl(),
            userState:          new FormControl(),
            userCountry:        new FormControl(),
        
            userSecurityRole:   new FormControl(),
            userGroup:          new FormControl(),
            userLinkedIn:       new FormControl()
        
        });
        
    }
    
    disableControlsForReadOnly() {
        
        console.log('Creating read-only form');
        this.userDetailsForm.controls['userPrefix'].disable();
        this.userDetailsForm.controls['fullName'].disable();
        this.userDetailsForm.controls['nickName'].disable();
        this.userDetailsForm.controls['userSuffix'].disable();
    
        this.userDetailsForm.controls['userOrganization'].disable();
        this.userDetailsForm.controls['userTenant'].disable();
        this.userDetailsForm.controls['userJobTitle'].disable();
        this.userDetailsForm.controls['userEmailAddress'].disable();
        this.userDetailsForm.controls['userMainContact'].disable();
    
        this.userDetailsForm.controls['userPhoneNumber'].disable();
        this.userDetailsForm.controls['userMobileNumber'].disable();
        
        this.userDetailsForm.controls['userAddress1'].disable();
        this.userDetailsForm.controls['userAddress2'].disable();
        this.userDetailsForm.controls['userCity'].disable();
        this.userDetailsForm.controls['userPostalCode'].disable();
        this.userDetailsForm.controls['userState'].disable();
        this.userDetailsForm.controls['userCountry'].disable();
    
        this.userDetailsForm.controls['userSecurityRole'].disable();
        this.userDetailsForm.controls['userGroup'].disable();
        this.userDetailsForm.controls['userLinkedIn'].disable();
        this.isReadOnly = true;
    }
    
    enableFormControlsForEdit() {
    
        this.userDetailsForm.controls['userPrefix'].enable();
        this.userDetailsForm.controls['fullName'].enable();
        this.userDetailsForm.controls['nickName'].enable();
        this.userDetailsForm.controls['userSuffix'].enable();
    
        this.isSuperAdmin()? this.userDetailsForm.controls['userOrganization'].enable(): this.userDetailsForm.controls['userOrganization'].disable();
        this.isSuperAdmin()? this.userDetailsForm.controls['userTenant'].enable(): this.userDetailsForm.controls['userTenant'].disable();
        this.userDetailsForm.controls['userJobTitle'].enable();
        this.userDetailsForm.controls['userEmailAddress'].enable();
        this.userDetailsForm.controls['userMainContact'].enable();
    
        this.userDetailsForm.controls['userPhoneNumber'].enable();
        this.userDetailsForm.controls['userMobileNumber'].enable();
    
        this.userDetailsForm.controls['userAddress1'].enable();
        this.userDetailsForm.controls['userAddress2'].enable();
        this.userDetailsForm.controls['userCity'].enable();
        this.userDetailsForm.controls['userPostalCode'].enable();
        this.userDetailsForm.controls['userState'].enable();
        this.userDetailsForm.controls['userCountry'].enable();
    
        this.userDetailsForm.controls['userSecurityRole'].enable();
        this.userDetailsForm.controls['userGroup'].enable();
        this.userDetailsForm.controls['userLinkedIn'].enable();
        this.isReadOnly = false;
    }
    

    getUserGroupList(params:string){
        this.usersService.getUserGroups(params)
            .subscribe(data => {
                    this.userGroups = data['results'];
                    this.listOfUserGroups = this.userGroups;
                },
                error => this.errorMessage = <any>error);
        
    }
    
    getUserById(params: string) {
        
        this.usersService.getUserById(params)
            .subscribe(data => {
                let results = data['results'];
                let userDocFromDB = data['results'][results.length-1];
                
                this.user = this.usersService.validateUserSchema(userDocFromDB);
                
                this.userDetailsForm.setValue({
                    userPrefix:         this.user.prefix,
                    fullName:           this.user.full_name,
                    nickName:           this.user.nick_name,
                    userSuffix:         this.user.suffix,
                    userOrganization:  this.user.organization.id,
                    userTenant:        this.user.tenant.id,
                    userJobTitle:       this.user.job_title,
                    userEmailAddress:   this.user.email_address,
                    userMainContact:    this.user.main_contact,
                    userPhoneNumber:    this.user.phone_number,
                    userMobileNumber:   this.user.mobile_number,
                    userAddress1:       this.user.address.address1,
                    userAddress2:       this.user.address.address2,
                    userCity:           this.user.address.city,
                    userPostalCode:     this.user.address.postal_code,
                    userState:          this.user.address.state.name,
                    userCountry:        this.user.address.country.name,
                    
                    userSecurityRole:   this.user.security_role,
                    userGroup:          this.user.group,
                    userLinkedIn:       this.user.linkedin
                    
                });
                
                this.path === ('edit' || 'new') ? this.enableFormControlsForEdit() : this.disableControlsForReadOnly();
                
            })
    }
    
    loadEditUser() {
        this.router.navigate(['users/edit/' + this.user.id]);
    }
    
    saveEditUser() {
        const updatedUser = this.userDetailsForm.value;
        let userId = updatedUser.userEmailAddress;

        let currentDate = new Date();
        let createdDate = new Date();
        let createdBy = this.currentUser.id;
        
        //This is for update tenant
        if (this.user) 
        {   
            userId = this.user.id;
            createdDate = this.user.time_created;
            createdBy = this.user.created_by;
        }


        if (userId) {
            console.log('Save ' + userId);

            const body = {
                id:                 userId,
                prefix:             updatedUser.userPrefix,
                full_name:          updatedUser.fullName,
                nick_name:          updatedUser.nickName,
                suffix:             updatedUser.userSuffix,
    
                organization: {
                   id: updatedUser.userOrganization,
                   name: this.organizations.find(org => org.id == updatedUser.userOrganization).name
                },       
                tenant:             {
                        id: updatedUser.userTenant,
                        name: this.tenants.find(t => t.id == updatedUser.userTenant).name
                },
                job_title:          updatedUser.userJobTitle,
                email_address:      updatedUser.userEmailAddress,
                main_contact:       updatedUser.userMainContact,
                phone_number:       updatedUser.userPhoneNumber,
                mobile_number:      updatedUser.userMobileNumber,
                address: {
                    address1:       updatedUser.userAddress1,
                    address2:       updatedUser.userAddress2,
                    city:           updatedUser.userCity,
                    state: {
                        code:       '',
                        name:       updatedUser.userState
                    },
                    country: {
                        code:       '',
                        name:       updatedUser.userCountry
                    },
                    postal_code:    updatedUser.userPostalCode
                },
                security_role:      updatedUser.userSecurityRole,
                group:              updatedUser.userGroup,
                linkedin:           updatedUser.userLinkedIn,
                time_updated:       this.currentDate,
                time_created:       createdDate,
                created_by:         createdBy,
                updated_by:         this.currentUser.id
                
            
            };
            
            let saveDoc = {
                id: userId,
                jsonBody: JSON.stringify(body)
            };
    
            //-- Save updated `User`
             this.usersService.saveNewOrUpdatedUser(saveDoc,this.path);
    
            this.router.navigate(['users']);
            
        } else {
            alert('Cannot save an empty [User Name]');
        }
    }
    
}