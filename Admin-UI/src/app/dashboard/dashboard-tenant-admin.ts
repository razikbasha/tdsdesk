import { Component, OnInit, ViewEncapsulation, Input,ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent }  from '../app.component';
import { SharedModule } from '../shared/shared.module';
import { Dashboard,DashboardDataSchema } from '../data-models/dashboard';
import { DashboardService } from '../core/dashboard.service';
import { TenantsService } from '../core/tenants.service';
import { UsecasesService } from '../core/usecases.service';
import { DevicesService } from '../core/devices.service';
import { AuthService }  from '../core/auth.service';
import { Chart } from 'angular-highcharts';
import { User } from '../data-models/user';
import { Organization, Tenant } from '../data-models/tenant';
import { DynamicChartComponent } from '../shared/dynamic-chart/dynamic-chart.component';
import { Highcharts } from 'angular-highcharts';
import { ReportService } from '../core/report.service';
import { ReportKPI } from '../data-models/report';


@Component({
    selector: 'dashboard-tenant-admin',
    templateUrl: './dashboard-tenant-admin.html',
    styleUrls: ['./dashboard-tenant-admin.css'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardTenantAdminPage implements OnInit {

    listOfDashboards: Dashboard[];
    dashboards: Dashboard[];
    options:Object;
    errorMessage:string;
    numberOfTenants:number;
    numberOfUseCases:number;
    numberOfDeviceTypes:number;
    numberOfDevices:number;
    numberOfDeviceModels: number;

    currentUser: User;
    //currentOrganization: Organization;
    currentTenant: Tenant;

    chart:Chart;
    chartData:DashboardDataSchema;
    tenantKPIs: ReportKPI[];

    chartOptionForm = new FormGroup({});


    //-- Inject HttpClient into your component or service
    constructor(private app:AppComponent, private router: Router, 
        private dashboardService: DashboardService,
        private tenantsService: TenantsService,
        private useCasesService: UsecasesService,
        private devicesService: DevicesService,
        private authService:AuthService,
        private reportService: ReportService,
        private fb:FormBuilder
    ) {
        app.setPageFooter(true);
        app.setPageTenantAdminSidebar(true);
        this.currentUser = new User();

        this.createForm();

    }
    
    ngOnInit(): void {

        window.dispatchEvent(new CustomEvent('dashboard-tenant-admin-ready'));

        if (!this.authService.isAuthenticated()) this.router.navigate(['login']);
        
        
        this.authService.currentUser.subscribe(user => {
                this.currentUser = user;
                this.onChanges();

              this.getTenantKPI(this.currentUser.tenant.id);
                this.chartOptionForm.patchValue({
                    chartOption: ''
                    });
                }
            );
    
       /*this.authService.currentUsersOrganization.subscribe(org =>{
            this.currentOrganization = org;
        });*/

        this.authService.currentUsersTenant.subscribe(tenant => {
            this.currentTenant = tenant;
            console.log(this.currentTenant);
            
        });
        

        //this.getDashboardList();

        //this.getNumberOfTenants();
       // this.getNumberOfDeviceTypes()
       // this.getNumberOfUseCases();
        //this.getNumberOfDeviceModels();
        //this.getNumberOfDevices();

    }

    onChanges()
    {
        this.chartOptionForm.get('chartOption').valueChanges.subscribe(val =>{
            if (this.currentUser && this.currentUser.tenant && this.currentUser.tenant.id)
                this.getDashboardDevicesData(this.currentUser.tenant.id.toLocaleLowerCase() + ((val.length >0)? '.' +val: val));
        });
    }
    
    createForm()
    {
         //-- Reactive Form
        this.chartOptionForm = this.fb.group({
            chartOption: ''          
        });
    }

    
  getTenantKPI(id:string){
    this.reportService.getReportKPIByTenantId(id)
      .subscribe(data=>{
          if (!(data['results'] && data['results'][0] && data['results'][0].kpi)) return;
          let kpiData = data['results'][0].kpi;
              this.tenantKPIs = kpiData;
      })
}

    getDashboardList() {
        this.dashboardService.getDashboards()
            .subscribe(data => {
                    this.listOfDashboards = data['results'];
                    this.dashboards = this.listOfDashboards;
                },
                error => this.errorMessage = <any>error);
        
    }
    
    getDashboardDevicesData(id:string){
        this.dashboardService.getDashboardHCDeviceDataById(id)
        .subscribe(data=>{
            let cData = data['results'];

          if (cData.length == 0 || !cData[0].highcharts) return;    
            let tmp =JSON.stringify(cData[0].highcharts).replace(/^({)/,"")
            tmp = tmp.replace(/}\s*$/, "");
            let chartType = 'line';
            if (id.includes('.1'))
            {
                chartType = 'column';
            }     
            else if (id.includes('.2'))
            {
                chartType = 'bar';
            }
            else if (id.includes('.3'))
            {
                
                chartType = 'areaspline';
            }
            tmp = "{ \"chart\": {\"type\": \""+ chartType +"\"}," + tmp + "}";
            this.options = JSON.parse(tmp);
            console.log(this.options);
            this.chart = new Chart(this.options);  
            
            console.log(this.chart.options.chart.type);
        },
        error => this.errorMessage = <any>Error);
    }
    
    getHCDashboardById(id:string)
    {
        this.dashboardService.getDashboardSeriesById(id)
            .subscribe(data=>{
                let hcData = data['results'];
                let series: Highcharts.IndividualSeriesOptions[];
                series = hcData[0];

                if (hcData.length == 0) return;
                //replace the current chart with new data
                while (this.chart.options.series.length >0) this.chart.options.series.pop();
                series.forEach(serie => {
                    this.chart.options.series.push(serie);
                });
            },
        error => this.errorMessage = <any> Error);
    }
   
   
    getNumberOfTenants(){
        this.tenantsService.getCountWithParams("")
        .subscribe(data => {
                let tenantCounts = data['count'];
                this.numberOfTenants = tenantCounts;
            },
            error => this.errorMessage = <any>error);
    }
    getNumberOfUseCases(){
        this.useCasesService.getCountWithParams("")
        .subscribe(data => {
                let useCaseCount = data['count'];
                this.numberOfUseCases = useCaseCount;
            },
            error => this.errorMessage = <any>error);
    }

    getNumberOfDeviceTypes(){
        this.devicesService.getDeviceTypeCountWithParams("")
        .subscribe(data => {
                let deviceTypeCount = data['count'];
                this.numberOfDeviceTypes = deviceTypeCount;
            },
            error => this.errorMessage = <any>error);
    }


    getNumberOfDeviceModels(){
        this.devicesService.getDeviceModelCountWithParams("")
        .subscribe(data => {
                let deviceModelCount = data['count'];
                this.numberOfDeviceModels = deviceModelCount;
            },
            error => this.errorMessage = <any>error);
    }

    getNumberOfDevices(){
        this.devicesService.getDeviceCountWithParams("")
        .subscribe(data => {
                let deviceCount = data['count'];
                this.numberOfDevices = deviceCount;
            },
            error => this.errorMessage = <any>error);
    }
}