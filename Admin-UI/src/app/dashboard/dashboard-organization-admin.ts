import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponent }  from '../app.component';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Dashboard,DashboardDataSchema } from '../data-models/dashboard';
import { DashboardService } from '../core/dashboard.service';
import { TenantsService } from '../core/tenants.service';
import { UsecasesService } from '../core/usecases.service';
import { DevicesService } from '../core/devices.service';
import { Chart } from 'angular-highcharts';
import { AuthService } from '../core/auth.service';
import { User } from '../data-models/user';
import { Tenant, Organization } from '../data-models/tenant';


@Component({
    selector: 'dashboard-organization-admin',
    templateUrl: './dashboard-organization-admin.html',
    styleUrls: ['./dashboard-organization-admin.css'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardOrganizationAdminPage implements OnInit {

    listOfDashboards: Dashboard[];
    dashboards: Dashboard[];
    options:Object;
    errorMessage:string;
    numberOfTenants:number;
    numberOfUseCases:number;
    numberOfDeviceTypes:number;
    numberOfDevices:number;
    numberOfDeviceModels: number;

    currentUser:User;
    currentOrganization: Organization;
    currentTenant: Tenant;

    chart:Chart;
    chartData:DashboardDataSchema;

    chartOptionForm = new FormGroup({});


    //-- Inject HttpClient into your component or service
    constructor(private app:AppComponent, private router: Router, 
        private dashboardService: DashboardService,
        private tenantsService: TenantsService,
        private useCasesService: UsecasesService,
        private devicesService: DevicesService,
        private authService: AuthService,
        private fb:FormBuilder
    ) {
       
        app.setPageFooter(true);
        app.setPageIIRPAdmin(true);
        this.createForm();
    }
    
    
    ngOnInit(): void {
        window.dispatchEvent(new CustomEvent('dashboard-organization-admin-ready'));


        if (!this.authService.isAuthenticated()) this.router.navigate(['login']);
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.onChanges();
            this.chartOptionForm.patchValue({
                chartOption: ''
                });
            }
        );

        this.authService.currentUsersOrganization.subscribe(org =>{
            this.currentOrganization = org;
        });
       
        //this.getDashboardList();

        this.getNumberOfTenants();
        this.getNumberOfUseCases();
        this.getNumberOfDeviceModels();
        this.getNumberOfDevices();
    }

    onChanges()
    {
        this.chartOptionForm.get('chartOption').valueChanges.subscribe(val =>{
            if (this.currentUser && this.currentUser.tenant && this.currentUser.organization.id)
                this.getDashboardDevicesData(this.currentUser.organization.id.toLowerCase() + ((val.length >0)? '.' +val: val));
        });
    }
    
    createForm()
    {
         //-- Reactive Form
        this.chartOptionForm = this.fb.group({
            chartOption: ''          
        });
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
            tmp = tmp.replace(/}\s*$/, "");let chartType = 'line';
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

                if (hcData.length == 0 ) return;
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