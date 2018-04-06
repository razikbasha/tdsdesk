import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';

//-- Services
import { UsecasesService } from '../core/usecases.service';
import { TenantsService }   from '../core/tenants.service';
import { CommonService } from '../core/common.service';
import { AuthService } from '../core/auth.service';

//-- Data Models
import { Collaborators, CommonLookups, UseCaseType } from '../data-models/common';
import { Tenant, ObjectEmail } from '../data-models/tenant';
import { UsecaseDocuments, UsecaseSchema, UsecaseTemplates, UsecaseStatuses } from '../data-models/usecase';
import { User } from '../data-models/user';
import { Group } from '../data-models/common';

@Component({
    selector: 'usecase-details',
    templateUrl: './usecase-details.component.html',
    styleUrls: ['./usecase-details.component.css']
})

export class UsecaseDetailsComponent implements OnInit {
    @Input() usecase = UsecaseSchema;
    currentUser:User;

    jsonBody = {};
    
    isReadOnly: boolean;
    errorMessage: string;
    path: any;
    id: string;
    paramKey: any;
    currentDate = new Date();
    
    //-- Lookups
    usecaseCollaborators = Collaborators;
    usecaseDocuments = UsecaseDocuments;
    usecaseStatuses = UsecaseStatuses;
    usecaseTemplates = UsecaseTemplates;
    usecaseIndustries:Group[];
    listOfIndustries:Group[];

    industryUsecaseTypes: UseCaseType[];
    usecaseTypes: UseCaseType[];

    usecaseTenants: Tenant[];
    
    //-- Inject HttpClient into your component or service
    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private usecasesService: UsecasesService,
                private tenantsService: TenantsService,
                private commonService: CommonService,
                private authService: AuthService) {
        //-- app.setPageContentFullWidth(false);
    }
    
    //-- Reactive Form
    usecaseDetailsForm = new FormGroup({});
    
    ngOnInit(): void {
        
        this.paramKey = this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log('id = ' + this.id);
        });

        this.path = this.route.snapshot.url[1]? this.route.snapshot.url[1].toString() : this.id;
        console.log('path = ' + this.path);
        //-- Make the HTTP request
        this.jsonBody = JSON.stringify({id: this.id});
        const params = '&name=id&value=' + this.id;
        
        //-- Make the HTTP request via Usecase & Tenant Service
        if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
        
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (this.isSuperAdmin())
            {
                this.getListOfTenants('');
                this.getUseCaseTypes('');
            }else
            {
                this.getListOfTenants('&name=id&value=' + this.currentUser.tenant.id);
                this.getUseCaseTypes('')
            }

        });
        
        this.getIndustryList();

        this.authService.currentUsersTenant.subscribe (tenant => {
            this.getUseCaseTypes('');
        });
 
        
        if (this.id) {
            this.getUsecaseById(params);
        }
        
        this.createFormDefault();
        this.industryOnChanges();
        
    }

    industryOnChanges()
    {
        this.usecaseDetailsForm.get('usecaseIndustry').valueChanges.subscribe(val =>{
            let filteredUsecaseTypes: UseCaseType[];
            //re-populate the UseCaseType list
            if (this.industryUsecaseTypes)
            {
                filteredUsecaseTypes = this.industryUsecaseTypes.filter( it => {
                    return (it.industry == val);
                });
                this.usecaseTypes = filteredUsecaseTypes;
            }
        });
        
    }
    getUseCaseTypes(filters:string)
    {
        this.usecasesService.getUsecaseTypes(filters)
            .subscribe(data => { 
                this.industryUsecaseTypes = data['results'];
                this.usecaseTypes = this.industryUsecaseTypes;
            },
            error => this.errorMessage = <any> error);
    }
    /**
     * User Methods
     ****************/
    
    cancelEditUsecase() {
        this.disableControlsForReadOnly();
        this.router.navigate(['usecases/' + this.id]);
    }
    
    closeUsecaseDetails() {
        this.router.navigate(['usecases'])
    }


    loadEditUsecase() {
        this.router.navigate(['usecases/edit/' + this.id]);
    }
    
    createFormDefault() {
        this.usecaseDetailsForm = this.fb.group({
            
            usecaseFriendlyName:        new FormControl(),
            usecaseStatus:              new FormControl(),
            usecaseTemplate:            new FormControl(),
            usecaseTenant:              new FormControl(),
            usecaseType:                new FormControl(),
            description:                new FormControl(),
            usecaseIndustry:            new FormControl(),
            userHierarchy:              new FormControl(),
            changeRoleFunctionality:    new FormControl(),
            userUnsubscribe:            new FormControl(),
            isUserInviteFeatureIncluded: new FormControl(),
            collaborators:              new FormControl(),
            usecaseCollaborator:        new FormControl(),
            usecaseCollaborateInviteNote:   new FormControl(),
            usecaseFileIconId:          new FormControl(),
            usecaseFileIconPath:        new FormControl(),
            usecaseDocuments:           new FormControl(),
            devices:                    new FormControl()
            
        });
    }
    
    disableControlsForReadOnly() {
        
        this.isReadOnly = true;

        this.usecaseDetailsForm.controls['usecaseFriendlyName'].disable();
        this.usecaseDetailsForm.controls['usecaseStatus'].disable();
        this.usecaseDetailsForm.controls['usecaseTemplate'].disable();
        this.usecaseDetailsForm.controls['usecaseTenant'].disable();
        this.usecaseDetailsForm.controls['usecaseType'].disable();
        
        this.usecaseDetailsForm.controls['description'].disable();
        this.usecaseDetailsForm.controls['usecaseIndustry'].disable();
        this.usecaseDetailsForm.controls['userHierarchy'].disable();
        this.usecaseDetailsForm.controls['changeRoleFunctionality'].disable();
        
        this.usecaseDetailsForm.controls['userUnsubscribe'].disable();
        this.usecaseDetailsForm.controls['isUserInviteFeatureIncluded'].disable();
        
        this.usecaseDetailsForm.controls['collaborators'].disable();
        this.usecaseDetailsForm.controls['usecaseCollaborator'].disable();
        this.usecaseDetailsForm.controls['usecaseCollaborateInviteNote'].disable();
        this.usecaseDetailsForm.controls['usecaseFileIconId'].disable();
        this.usecaseDetailsForm.controls['usecaseFileIconPath'].disable();
        this.usecaseDetailsForm.controls['usecaseDocuments'].disable();
        this.usecaseDetailsForm.controls['devices'].disable();
        
    }
    
    enableFormControlsForEdit() {
        
        this.isReadOnly = false;
        this.usecaseDetailsForm.controls['usecaseFriendlyName'].enable();
        this.usecaseDetailsForm.controls['usecaseStatus'].enable();
        this.usecaseDetailsForm.controls['usecaseTemplate'].enable();
        this.isSuperAdmin()? this.usecaseDetailsForm.controls['usecaseTenant'].enable(): this.usecaseDetailsForm.controls['usecaseTenant'].disable();
        this.usecaseDetailsForm.controls['usecaseType'].enable();
        
        this.usecaseDetailsForm.controls['description'].enable();
        this.usecaseDetailsForm.controls['usecaseIndustry'].enable();
        this.usecaseDetailsForm.controls['userHierarchy'].enable();
        this.usecaseDetailsForm.controls['changeRoleFunctionality'].enable();
        
        this.usecaseDetailsForm.controls['userUnsubscribe'].enable();
        this.usecaseDetailsForm.controls['isUserInviteFeatureIncluded'].enable();
        
        this.usecaseDetailsForm.controls['collaborators'].enable();
        this.usecaseDetailsForm.controls['usecaseCollaborator'].enable();
        this.usecaseDetailsForm.controls['usecaseCollaborateInviteNote'].enable();
        this.usecaseDetailsForm.controls['usecaseFileIconId'].enable();
        this.usecaseDetailsForm.controls['usecaseFileIconPath'].enable();
        this.usecaseDetailsForm.controls['usecaseDocuments'].enable();
        this.usecaseDetailsForm.controls['devices'].enable();
        
    }
    


    isSuperAdmin():boolean{
        return this.currentUser.security_role == 'Super Admin';
    }
    getListOfTenants(params:string){
        let filters = ''; //need to add tenant id here
        this.tenantsService.getTenants(params)
            .subscribe(data => {
                    this.usecaseTenants = data['results'];
                },
                error => this.errorMessage = <any>error);
    }

    getIndustryList() {
                this.commonService.getIndustries()
                    .subscribe( data => {
                        this.listOfIndustries = data ["results"];
                            this.usecaseIndustries = this.listOfIndustries;
                    },
                );
               
        
            }
    
    getUsecaseById(params: string) {
        
        this.usecasesService.getUsecaseById(params)
            .subscribe(data => {
                let results = data['results'];
                let updatedUsecase = data['results'][results.length-1] || null;
                console.log('Result of GET Usecase Details via Usecase.Service %j', updatedUsecase);
                
                if (updatedUsecase) {
                    this.usecase = this.usecasesService.validateUsecaseSchema(updatedUsecase);
                    this.usecaseDetailsForm.setValue({
                        usecaseFriendlyName:        this.usecase.friendly_name,
                        usecaseStatus:              this.usecase.usecase_status,
                        usecaseIndustry:            this.usecase.industry,
                        usecaseTemplate:            this.usecase.usecase_template,
                        usecaseTenant:              this.usecase.usecase_tenant? this.usecase.usecase_tenant: this.currentUser.tenant.id,
                        usecaseType:                this.usecase.usecase_type,
                        description:                this.usecase.description,
                        userHierarchy:              this.usecase.user_info.user_hierarchy,
                        changeRoleFunctionality:    this.usecase.user_info.change_role_functionality,
                        userUnsubscribe:            this.usecase.user_info.user_unsubscribe,
                        isUserInviteFeatureIncluded: this.usecase.user_info.is_user_invite_feature_included,
                        collaborators:     this.usecase.collaborators,
                        usecaseCollaborator: '',
                        usecaseCollaborateInviteNote: '',
                        usecaseFileIconId:      this.usecase.files.usecase_icon.id,
                        usecaseFileIconPath:    this.usecase.files.usecase_icon.path,
                        usecaseDocuments: [
                            {
                                id: '7eea57b5-61a0-4efa-b9e3-26c652f8c821',
                                filename: 'Water Filter Model 56568.pdf',
                                path: 'https://iotworldlabs.s3.bucketname1/'
                            }, {
                                id: 'cfead218-c333-42ce-8188-51c34dae6e4b',
                                filename: 'Water Filter Model 56568 MSDS.pdf',
                                path: 'https://iotworldlabs.s3.bucketname1/'
                            }
                        ],
                        devices: [
                            {'device_model_id':'D4DT-SG-000','device_model':'SmartGeyser-D4DT-Model2','device_type':'water-heater','sensors':'3','data_freq':'10','packet_size':'512','json_fields':'timeStamp deviceId field1 field2 field3','data_protocols':'HTTPS-POST-JSON'},
                            {'device_model_id':'D4DT-WP-101','device_model':'WaterPurifier-D4DT-Model1','device_type':'water-filter','sensors':'3','data_freq':'12','packet_size':'256','json_fields':'timeStamp deviceId field1 field2 field3','data_protocols':'HTTPS-POST-JSON'},
                            {'device_model_id':'D4DT-WP-102','device_model':'WaterPurifier-D4DT-Model1','device_type':'water-filter','sensors':'3','data_freq':'12','packet_size':'256','data_fields':'timeStamp deviceId field1 field2 field3','data_interface':'MQTT,HTTPS,POST,JSON'},
                            {'device_model_id':'D4DT-WP-103','device_model':'WaterPurifier-D4DT-Model1','device_type':'water-filter','sensors':'3','data_freq_perhour':'12','packet_size':'256','data_fields':'timeStamp deviceId field1 field2 field3','data_interface':'MQTT,HTTPS,POST,JSON'},
                            {'device_model_id':'D4DT-WP-104','device_model':'WaterPurifier-D4DT-Model1','device_type':'water-filter','sensors':'3','data_freq_perhour':'12','packet_size_bytes':'256','data_fields':'timeStamp deviceId field1 field2 field3','data_interface':'MQTT,HTTPS,POST,JSON'},
                            {'device_model_id':'D4DT-WP-105','device_model':'TEST-WaterPurifier-D4DT-Model1','device_type':'water-filter','sensors':'3','data_freq_perhour':'12','packet_size_bytes':'256','data_fields':'timeStamp deviceId field1 field2 field3','data_interface':'MQTT,HTTPS,POST,JSON'}
                        ]
                        
                    });
                    
                    this.path === 'edit'? this.enableFormControlsForEdit() : this.disableControlsForReadOnly();
                    
                } else {
                    this.router.navigate(['usecases'])
                }
                
            })
    }
    
   
    
    saveEditUsecase() {
        const updatedUsecase = this.usecaseDetailsForm.value;
        let useCaseId = updatedUsecase.usecaseFriendlyName.replace(/ /g, '');

        if (updatedUsecase.usecaseCollaborator)
        {
            let contact = { email:'',status:'CONFIRMED', invite_note:''};
            contact.email = updatedUsecase.usecaseCollaborator;
            contact.invite_note = updatedUsecase.usecaseCollaborateInviteNote;
            this.usecaseCollaborators.push(contact);
        }

        if (useCaseId) {
            
            const body = {
                id:                 useCaseId || '',
                name:               useCaseId || '',
                friendly_name:      updatedUsecase.usecaseFriendlyName || '',
                usecase_status:     updatedUsecase.usecaseStatus || '',
                industry:           updatedUsecase.usecaseIndustry || '',
                usecase_template:   updatedUsecase.usecaseTemplate || '',
                usecase_tenant:     updatedUsecase.usecaseTenant || this.currentUser.tenant.id,
                usecase_type:       updatedUsecase.usecaseType || '',
                description:        updatedUsecase.description || '',
                
                user_info: {
                    user_hierarchy:                     updatedUsecase.userHierarchy || '',
                    change_role_functionality:          updatedUsecase.changeRoleFunctionality || '',
                    user_unsubscribe:                   updatedUsecase.userUnsubscribe || '',
                    is_user_invite_feature_included:    updatedUsecase.isUserInviteFeatureIncluded || true,
                },
                collaborators:   this.usecaseCollaborators,
                files: {
                    usecase_icon: {
                        //-- Temporary; must be UUID.v4()
                        id:         updatedUsecase.usecaseFileIconId || '',
                        path:       updatedUsecase.usecaseFileIconPath || ''
                    },
                    usecase_documents: [
                        //-- Temporary; hard-coded until this function of adding documents is added
                        {
                            id: '7eea57b5-61a0-4efa-b9e3-26c652f8c821',
                            filename: 'Water Filter Model 56568.pdf',
                            path: 'https://iotworldlabs.s3.bucketname1/'
                        }, {
                            id: 'cfead218-c333-42ce-8188-51c34dae6e4b',
                            filename: 'Water Filter Model 56568 MSDS.pdf',
                            path: 'https://iotworldlabs.s3.bucketname1/'
                        }
                    ],
                },
                updated_date:       this.currentDate,
                updated_by:        ''
            };
            
            let saveDoc = {
                id: useCaseId,
                jsonBody: JSON.stringify(body)
            };
            
            this.usecasesService.saveNewOrUpdatedUsecase(saveDoc,this.path);
            
            this.router.navigate(['usecases']);
            
        } else {
            alert('Cannot save an empty [Use Case]');
        }
    }
    
}