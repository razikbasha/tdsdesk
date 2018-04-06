import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

import { NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../../data-models/user';
import { TenantConfig } from '../../data-models/tenant';
import { TenantsService } from '../../core/tenants.service';
import { AppComponent } from '../../app.component';

import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
    @Input() page_with_two_sidebar : boolean;
    @Input() page_with_mega_menu : boolean;
    
    company_logo_path: string; 
    currentUser: User;
    currentProfile: any;
    userHeaderForm = new FormGroup({});

    constructor( 
        private router: Router,
        private authService:AuthService,
        private tenantsService:TenantsService
    ) 
    {
        this.currentProfile = {
            email: '', picture: 'javascript:;'
        }

    }

   

    ngOnInit() {


        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.setLogoPath(this.currentUser);
        });
        
        this.authService.currentProfile.subscribe(profile =>{
            this.currentProfile = profile;
        })
        
    }

    setLogoPath(user:User)
    {
       
        if (user && user.organization && user.organization.id )
        {
            this.company_logo_path = '/assets/img/'+ user.organization.id.toLowerCase() + '-logo.png';
            return;
        }
        else if (!user || !user.tenant || !user.tenant.id)
        {
            this.company_logo_path = '/assets/img/d4dt-logo.png';
            return;
        }
        let imagePath:string = '';
        this.tenantsService.getTenantConfig("&name=id&value=" + user.tenant.id)       
        .subscribe(c =>{
            let tc = c["results"];
            if (tc[0])
                imagePath = tc[0].urlPrefix + (tc[0].urlPrefix.endsWith('/')? '':'/');
            else
            {
                //imagePath= environment.imageEndpoint  + '/' + user.tenant.id + '/'; // we should not get here!!!
                alert('You have Super Admin role; Tenant Config object is empty. Please fix before continue.')
            }
        });

        
        this.tenantsService.getTenantById('&name=id&value=' + user.tenant.id)
        .subscribe(data => {
            let results = data['results']
            let tenantDocFromDB = results[results.length-1];
            let tenant = this.tenantsService.validateTenantSchema(tenantDocFromDB);
            this.company_logo_path = imagePath + tenant.branding.branding_logo.path;
            console.log(this.company_logo_path);
        });
    
    }

   
    loadUserDetailsPage(params:string)
    {
        this.router.navigate(['users/'+params])
    }
}