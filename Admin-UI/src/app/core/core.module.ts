import { NgModule } from '@angular/core';
import { Title }                     from '@angular/platform-browser';


//-- Services
import { TenantsService }           from './tenants.service';
import { OrganizationsService }     from './organizations.service';
import { ObjectsService }           from './objects.service';
import { UsecasesService }          from './usecases.service';
import { DashboardService }         from './dashboard.service';
import { DevicesService }           from './devices.service';
import { UsersService }             from './users.service';
import { ImportService }            from './import.service';
import { CommonService }            from './common.service';
import { SecurityRolesService }     from './securityroles.service';
import { AuthGuard }                from './auth.guard';
import { ReportService }            from './report.service';

@NgModule({
    providers: [ 
        DashboardService,
        DevicesService,
        ImportService,
        OrganizationsService, 
        ObjectsService,
        TenantsService,
        Title,
        UsecasesService,
        UsersService ,
        SecurityRolesService, 
        CommonService, AuthGuard,
        ReportService

     ]
})

export class CoreModule{}