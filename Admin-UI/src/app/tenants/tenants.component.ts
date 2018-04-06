import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TenantsService } from '../core/tenants.service';
import { AuthService } from '../core/auth.service';
import { User } from '../data-models/user';
import { Tenant } from '../data-models/tenant';

@Component({
    selector: 'table-manage-combine',
    templateUrl: './tenants.component.html',
    styleUrls: ['./tenants.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class TenantsComponent implements OnInit {
    
    private currentUser: User;
    private listOfTenants: Tenant[];
    
    // -- Inject HttpClient into your component or service
    constructor(private router: Router,  private tenantsService:TenantsService, private authService:AuthService) {};

    ngOnInit(): void {
        window.dispatchEvent(new CustomEvent('tenants-ready'));

        if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            let filters:string = '';
            if (this.isSuperAdmin()) 
                filters = '';
            else
            {
                filters = '&name=details.tenant_admins.email&value=' + this.currentUser.email_address + '&name=id&value=' + ( this.currentUser.tenant.id? this.currentUser.tenant.id : '0');
            }
            this.tenantsService.getTenants(filters)
                .subscribe(data => {
                    this.listOfTenants = data['results'];
                    if (this.listOfTenants.length == 0)
                        filters = '&name=details.organization&value=' + this.currentUser.organization.id;
                        this.tenantsService.getTenants(filters)
                            .subscribe( datafilteredbyorg => {
                                this.listOfTenants = datafilteredbyorg['results'];
                                if (this.listOfTenants.length == 1 && !this.isSuperAdmin())
                                {
                                    this.loadTenantDetailsPage(this.listOfTenants[0].id);
                                }    
                            });
            });

        });

       
       
    };

    isSuperAdmin():boolean
    {
        return this.currentUser.security_role == "Super Admin";
    }


    loadTenantDetailsPage(params:string)
    {
        this.router.navigate(['tenants/'+params])
    }

    loadTenantNewPage() {
        this.router.navigate(['tenants/new']);
    }
    
    loadTenantImportPage() {
        this.router.navigate(['tenants/import']);
    }
    
   

}