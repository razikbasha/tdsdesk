import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usecase } from '../data-models/usecase';
import { Tenant } from '../data-models/tenant';
import { User } from '../data-models/user';


//-- Services
import { UsecasesService } from '../core/usecases.service';
import { UsersService } from '../core/users.service';
import { AuthService } from '../core/auth.service';

@Component ({
    selector: 'usecases-list',
    templateUrl: './usecases.component.html',
    styleUrls: ['./usecases.component.css']
})

export class UsecasesComponent implements OnInit {
    currentUser: User;
    currentTenant: Tenant;

    listOfUsecases: Usecase[];
    errorMessage: string;
    permissionFiltersWithValues = '';
    
    //-- Inject HttpClient into your component or service
    constructor(private router: Router,
                private usersService: UsersService,
                private usecasesService: UsecasesService,
                private authService: AuthService) {}
    
    ngOnInit(): void {
        window.dispatchEvent(new CustomEvent('usecases-ready'));

        if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
        
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (this.isSuperAdmin()) 
            {
                this.getUsecasesList('');
            }
            else
            {
                this.getUsecasesList('&name=usecase_tenant&value=' + user.tenant.id);
            }

        });

        
    }
    


    isSuperAdmin():boolean{
        return this.currentUser.security_role == 'Super Admin';
    }

    
    
    getUsecasesList(params: string) {
    
        this.usecasesService.getUsecases(params)
            .subscribe(data => {
                    this.listOfUsecases = data['results'];
                },
                error => this.errorMessage = <any>error);
    
    }
    
    getUsecasesTemplates() {
        //console.log('Retrieving templates for Use Cases');
        alert('getUsecase Templates not yet implemented.')
    }
    
    loadUseCaseDetailsPage(param:string) {
        this.router.navigate(['usecases/' + param]);
    }
    
    loadUsecasesNewPage() {
        this.router.navigate(['usecases/new']);
    }
    
    loadUsecasesImportPage() {
        this.router.navigate(['usecases/import']);
    }

    
}

