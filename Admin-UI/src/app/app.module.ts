import { NgModule, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title }                     from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute }    from '@angular/router';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpClientModule,  HTTP_INTERCEPTORS }                         from '@angular/common/http';
import { HttpModule }                               from '@angular/http';
import { DropzoneDirective, DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// Main Component
import { AppRoutingModule }         from './app-routing.module';
import { AppComponent }             from './app.component';
import { SidebarTwoComponent }      from './sidebar-two/sidebar-two.component';
import { ContentComponent }         from './content/content.component';
import { TopMenuComponent }         from './top-menu/top-menu.component';
import { ThemePanelComponent }      from './theme-panel/theme-panel.component';
import { ChartModule }              from 'angular-highcharts';

import { TokenInterceptor } from './core/token.interceptor';


import { CallbackComponent }    from './callback/callback.component';

// Shared Component
import { AppConfigModule }      from './app-config.module';
import { SharedModule }         from './shared/shared.module';
import { AuthModule }           from './auth/auth.module';
import { ImportComponent }      from './shared/import/import.component';
import { DynamicDataTableComponent }    from './shared/dynamic-data-table/dynamic-data-table.component';
import { DynamicChartComponent }    from './shared/dynamic-chart/dynamic-chart.component';
import { ReportRequestComponent }   from './reports/report-request/report-request.component';

import { DashboardModule }      from './dashboard/dashboard.module';
import { DashboardBusinessPage } from './dashboard/dashboard-business/dashboard-business.component';

import { TenantsImportComponent } from './tenants/tenants-import.component';
import { OrganizationsImportComponent } from './tenants/organizations-import.component';
import { UsecasesImportComponent } from './usecases/usecases-import.component';
import { DevicesImportComponent } from './devices/devices-import.component';
import { DevicesTypesImportComponent } from './devices/device-types-import.component';
import { UsersImportComponent } from './users/users-import.component';
import { UserGroupsImportComponent } from './users/user-groups-import.component';
import { SecurityRolesImportComponent } from './securityroles/security-roles-import.component';
import { ObjectsImportComponent } from './objects/objects-import.component';



import { TenantModule }         from './tenants/tenant.module';
import { UsecaseModule }        from './usecases/usecase.module';
import { DeviceModule }         from './devices/devices.module';
import { ObjectModule }         from './objects/object.module';
import { UserModule }           from './users/user.module';
import { SecurityRoleModule }   from './securityroles/securityrole.module';
import { CoreModule }           from './core/core.module';
import { AuthService }          from './core/auth.service';
import { ReportResultsHchartComponent } from './reports/report-results-hchart/report-results-hchart.component';
import { ReportResultsRawComponent } from './reports/report-results-raw/report-results-raw.component';



@NgModule({
    imports:        [ 
        BrowserModule, 
        AppRoutingModule, 
        FormsModule, 
        ReactiveFormsModule, 
        HttpClientModule, 
        HttpModule,
        DropzoneModule,
        ChartModule,

        AppConfigModule,
        SharedModule,
        AuthModule,
        CoreModule,

        DashboardModule,
        TenantModule,
       
        UsecaseModule,
        UserModule,
        DeviceModule,
        ObjectModule,
        SecurityRoleModule
    ],
    declarations:   [ 
        AppComponent,
        SidebarTwoComponent,
        ContentComponent,
        ThemePanelComponent,
        TopMenuComponent,

        DashboardBusinessPage,

        ImportComponent,
        DynamicDataTableComponent,
        DynamicChartComponent,
        ReportRequestComponent,
        ReportResultsHchartComponent,
        ReportResultsRawComponent,
        TenantsImportComponent,
        OrganizationsImportComponent,
        UsecasesImportComponent,
        DevicesImportComponent,
        DevicesTypesImportComponent,
        UsersImportComponent,
        UserGroupsImportComponent,
        SecurityRolesImportComponent,
        ObjectsImportComponent,

        CallbackComponent,

     ],
    
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [ 
        AppComponent,
        AuthService,

        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
        
     ],
     
    bootstrap: [ AppComponent ]
})

export class AppModule {
    
    constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
        
    }
    
    ngOnInit()
    {
        this.router.events.subscribe((e) => {
            // change page title when url change
            if (e instanceof NavigationEnd) {
                var title = 'D4DT';
                this.titleService.setTitle(title);                
                window.dispatchEvent(new CustomEvent('page-reload'));
            }
        });
    }
}