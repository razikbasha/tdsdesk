import { Component, OnInit,ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Organization,TenantConfig } from '../data-models/tenant';
import { Countries, StatesOrProvincesPerCountry, CommonLookups,Group, CodeNamePair } from '../data-models/common';
import { OrganizationsService } from '../core/organizations.service';
import { DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { CommonService } from '../core/common.service';

@Component({
    selector: 'organization-details',
    templateUrl: './organization-details.component.html',
    styleUrls: ['./organization-details.component.css']
})

export class OrganizationDetailsComponent implements OnInit {
    public config: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: null,
        method: 'POST',
        paramName: 'fileToUpload',
       //url: environment.webserverEndpoint + '/upload?qquuid='
       url: environment.webserverEndpoint + '/upload/submit?token='+ this.authService.getToken()
      };
    
      @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
      
    organization: any;
    
    private organizationGetEndpoint = environment.apiEndpoint + '&a=find&ot=Organization&name=id&value=';
    id: string;
    private sub: any;
    jsonBody: any;
    urlBrandingLogo: string;
    imagePath: string;
    
    errorMessage: string;
    path: any;
    paramKey: any;
    currentDate = new Date();


    isReadOnly: boolean;

    organizationDetailsForm = new FormGroup({});

    //-- Lookups
    commonLookups = CommonLookups;
    countries = this.commonService.getCountryList();
    statesOrProvincesPerCountry = this.commonService.getStateByCountry('United States');

    listOfIndustries:Group[];


    //-- Inject HttpClient into your component or service
    constructor(
            private app: AppComponent, 
            private router: Router, 
            private route: ActivatedRoute, 
            private fb: FormBuilder,
            private organizationsService: OrganizationsService,
            private authService: AuthService,
            private commonService: CommonService) 
            {
        app.setPageContentFullWidth(false);
    }

    ngOnInit() {


        if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
        
        this.paramKey = this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log('id = ' + this.id);
        });
    
        this.path = this.route.snapshot.url[1]? this.route.snapshot.url[1].toString() : this.id;
        
        this.jsonBody = JSON.stringify({id: this.id});
        const params = '&name=id&value=' + this.id;
        this.imagePath = environment.imageEndpoint + '/' + this.id + '/'
        if (this.id)
        {
            this.getOrganizationById(params);
            this.setImagePath();
        }
        
        this.getIndustryList();
        this.createFormDefault();
        this.countryOnChanges();
    }

    setImagePath()
    {
        this.imagePath = environment.imageEndpoint + '/' + this.id + '/';
    }

    countryOnChanges()
    {
        this.organizationDetailsForm.get('organizationCountry').valueChanges.subscribe(val =>{
            this.statesOrProvincesPerCountry = this.commonService.getStateByCountry(val);
        });
    }
    createFormDefault() {
        
            this.organizationDetailsForm = this.fb.group({
                organizationName:       new FormControl(),
                organizationDomainName: new FormControl(),
                organizationIndustry:   new FormControl(),
                organizationUseCases: new FormControl(),
                organizationMainContact:new FormControl(),
                organizationAddress1:   new FormControl(),
                organizationAddress2:   new FormControl(),
                organizationCity:   new FormControl(),
                organizationState:  new FormControl(),
                organizationCountry:    new FormControl(),
                organizationPostalCode: new FormControl(),
                brandingLogo: new FormControl()
            
            });
            
        }

    
        disableControlsForReadOnly() {
            
            
            this.isReadOnly = true;
            this.organizationDetailsForm.controls['organizationName'].disable();
            this.organizationDetailsForm.controls['organizationDomainName'].disable();
            this.organizationDetailsForm.controls['organizationIndustry'].disable();
            this.organizationDetailsForm.controls['organizationUseCases'].enable();
            this.organizationDetailsForm.controls['organizationMainContact'].disable();
            this.organizationDetailsForm.controls['organizationAddress1'].disable();
            this.organizationDetailsForm.controls['organizationAddress2'].disable();
            this.organizationDetailsForm.controls['organizationCity'].disable();
            this.organizationDetailsForm.controls['organizationState'].disable();
            this.organizationDetailsForm.controls['organizationCountry'].disable();
            this.organizationDetailsForm.controls['organizationPostalCode'].disable();

            this.organizationDetailsForm.controls['brandingLogo'].disable();          
        }

        enableFormControlsForEdit() {
            
                
                this.isReadOnly = false;
                this.organizationDetailsForm.controls['organizationName'].enable();
                this.organizationDetailsForm.controls['organizationDomainName'].enable();
                this.organizationDetailsForm.controls['organizationIndustry'].enable();    
                this.organizationDetailsForm.controls['organizationUseCases'].enable();
                this.organizationDetailsForm.controls['organizationMainContact'].enable();
                this.organizationDetailsForm.controls['organizationAddress1'].enable();
                this.organizationDetailsForm.controls['organizationAddress2'].enable();
                this.organizationDetailsForm.controls['organizationCity'].enable();
                this.organizationDetailsForm.controls['organizationState'].enable();
                this.organizationDetailsForm.controls['organizationCountry'].enable();
                this.organizationDetailsForm.controls['organizationPostalCode'].enable();

                this.organizationDetailsForm.controls['brandingLogo'].enable();            
                
            }

getOrganizationById(params: string) {
                
                this.organizationsService.getOrganizationById(params)
                    .subscribe(data => {
                        let results = data['results']
                        let organizationDocFromDB = results[results.length-1];
                        console.log('Result of GET Organization Details from Organization.Service %j', organizationDocFromDB);

                
                        
                        //-- Validate the `organizationDocFromDB` JSON form and fix any missing attributes
                        this.organization = this.organizationsService.validateOrganizationSchema(organizationDocFromDB);
                        
                        console.log('Result of ValidateUserSchema from Organization.Service %j', this.organization);
                        
                        console.log('Setting values...');
                        this.organizationDetailsForm.patchValue({
                            organizationName:   this.organization.name,
                            organizationDomainName: this.organization.domain_name,
                            organizationIndustry: this.organization.industry,
                            organizationUseCases: this.organization.use_cases,
                            organizationMainContact:    this.organization.main_contact,
                            organizationAddress1:       this.organization.address.address1,
                            organizationAddress2:       this.organization.address.address2,
                            organizationCity:           this.organization.address.city,
                            organizationPostalCode:     this.organization.address.postal_code,
                            organizationState:          this.organization.address.state.name,
                            organizationCountry:        this.organization.address.country.name,
                            brandingLogo: this.organization.branding_logo.path
                           
                        });
                        this.urlBrandingLogo = this.organization.branding_logo? this.imagePath + this.organization.branding_logo.path: '';
                        
                        
                        this.path === 'edit'? this.enableFormControlsForEdit() : this.disableControlsForReadOnly();
                        
                    })
            }
    loadEditOrganization() {
        this.router.navigate(['organizations/edit/'+ this.organization.id])
    }

    loadOrganization() {
        this.router.navigate(['organizations/' + this.organization.id]);
    }

    saveEditOrganization() {
        const updatedOrganization = this.organizationDetailsForm.value;
        let strDomain = updatedOrganization.organizationDomainName.split('.');
        let organizationId =  strDomain [strDomain.length-2]; //assign id based on domain name only for new
        let currentDate = new Date();
        let createDate = new Date();
        
        //This is for update organization
        if (this.organization) 
        {   
            organizationId = this.organization.id;
            createDate = this.organization.time_created;
        }

        if (organizationId) {
            console.log('Updating ' + organizationId);
            const body = {
                id:                 organizationId,
                name:               updatedOrganization.organizationName,
                domain_name:        updatedOrganization.organizationDomainName,
                industry:           updatedOrganization.organizationIndustry,
                use_cases:          updatedOrganization.organizationUseCases,
                main_contact:       updatedOrganization.organizationMainContact,
                address: {
                    address1:       updatedOrganization.organizationAddress1,
                    address2:       updatedOrganization.organizationAddress2,
                    city:           updatedOrganization.organizationCity,
                    state: {
                        code:       '',
                        name:       updatedOrganization.organizationState
                    },
                    country: {
                        code:       '',
                        name:       updatedOrganization.organizationCountry
                    },
                    postal_code:    updatedOrganization.organizationPostalCode
                },
                branding_logo: {
                    id:'',
                    path: updatedOrganization.brandingLogo
                },
                time_created: createDate,
                time_updated: this.currentDate                           
            };
        

            let saveDoc = {
                id: organizationId,
                jsonBody: JSON.stringify(body)
            };
    
            //-- Save updated `Organization`
            this.organizationsService.saveOrganization(saveDoc,this.path); //new or edit

            this.router.navigate(['organizations']) //go back to the edit screen
            
        } else {
            alert('Cannot save an empty [Organization Name]');
        }
    }


    onUploadError(args: any) {
        console.log('onUploadError:', args);
        
      }
    
      onUploadSuccess(args: any, branding:string) {
        console.log('onUploadSuccess:', args);
        switch(branding)
        {
            case "brandingLogo":
            {
                this.organizationDetailsForm.patchValue({
                    brandingLogo: args[0].name
                });
                return;
            }
        }
       
        
      }

      getIndustryList() {
                this.commonService.getIndustries()
                    .subscribe( data => {
                        let industries = data ["results"];
                            this.listOfIndustries = industries;
                    },
                );
               
        
            }
      
}