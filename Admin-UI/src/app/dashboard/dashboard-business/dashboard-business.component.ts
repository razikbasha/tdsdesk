import { Component, OnInit, ViewEncapsulation, 
        Input,ViewChild, ViewChildren, OnChanges, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent }  from '../../app.component';
import { SharedModule } from '../../shared/shared.module';
import { Dashboard,DashboardDataSchema } from '../../data-models/dashboard';
import { DashboardService } from '../../core/dashboard.service';
import { TenantsService } from '../../core/tenants.service';
import { UsecasesService } from '../../core/usecases.service';
import { DevicesService } from '../../core/devices.service';
import { AuthService }  from '../../core/auth.service';
import { Chart } from 'angular-highcharts';
import { User } from '../../data-models/user';
import { Organization, Tenant } from '../../data-models/tenant';
import { DynamicChartComponent } from '../../shared/dynamic-chart/dynamic-chart.component';
import { Highcharts } from 'angular-highcharts';
import { ReportRequest, ReportKPI } from '../../data-models/report';
import { ReportService }    from '../../core/report.service';
import { ReportRequestComponent } from 'app/reports/report-request/report-request.component';
import { ReportResultsRawComponent } from 'app/reports/report-results-raw/report-results-raw.component';



@Component({
  selector: 'dashboard-business',
  templateUrl: './dashboard-business.component.html',
  styleUrls: ['./dashboard-business.component.css']
})
export class DashboardBusinessPage implements OnInit {
    @ViewChild(ReportRequestComponent) reportRequestComponent:ReportRequestComponent;
    @ViewChildren(ReportResultsRawComponent) reportResultsRaws: QueryList<ReportResultsRawComponent>;

  listOfDashboards: Dashboard[];
  dashboards: Dashboard[];
  options:Object;
  errorMessage:string;
  numberOfTenants:number;
  numberOfUseCases:number;
  numberOfDeviceTypes:number;
  numberOfDevices:number;
  numberOfDeviceModels: number;
  reportRequest: ReportRequest; reportRequestDynamicReport: ReportRequest;
  reportRequestDataViews: ReportRequest[]=[];
  maxAvailableDataViews: number = 10;
  listOfDeviceModels: string[];

  currentUser: User;
  //currentOrganization: Organization;
  currentTenant: Tenant;

  chart:Chart;
  chartData:DashboardDataSchema;

  chartOptionForm = new FormGroup({});
  tenantKPIs: ReportKPI[];


  //-- Inject HttpClient into your component or service
  constructor(private app:AppComponent, private router: Router, 
      private dashboardService: DashboardService,
      private tenantsService: TenantsService,
      private useCasesService: UsecasesService,
      private devicesService: DevicesService,
      private authService:AuthService,
      private reportService:ReportService,
      private fb:FormBuilder
  ) {
      app.setPageFooter(true);
      app.setPageTenantAdminSidebar(true);
      this.currentUser = new User();

      this.createForm();

  }
  
  ngOnInit(): void {


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
  

      this.authService.currentUsersTenant.subscribe(tenant => {
          this.currentTenant = tenant;
          console.log(this.currentTenant);
          
      });
      

      this.reportRequest = new ReportRequest();
      this.reportRequest.data_source = 'T_heromotocorp_iirp.DMTable_hero_sm_honn_mtl'
      this.reportRequest.result_format = { name: 'raw', chart_type: '',data_table_view_id:this.reportRequest.data_source.toLowerCase()} ;
      //this.getListOfDeviceModels();


      window.dispatchEvent(new CustomEvent('dashboard-business-ready'));
  }

  onChanges()
  {
      this.chartOptionForm.get('chartOption').valueChanges.subscribe(val =>{
          if (this.currentUser && this.currentUser.tenant && this.currentUser.tenant.id)
              this.getDashboardDevicesData(this.currentUser.tenant.id.toLocaleLowerCase() + ((val.length >0)? '.' +val: val));
      });
  }

  generateReport(rr:ReportRequest)
  {
    this.reportRequest = rr;
    this.reportRequest.result_format.data_table_view_id='data-table-business-dyanmic-report'
    this.reportRequestDynamicReport = this.reportRequest;
    
    this.reportResultsRaws.last.getResults();

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

    let params = '&name=tenant_id&value=' + this.currentUser.tenant.id;
      this.devicesService.getDeviceModelCountWithParams(params)
      .subscribe(data => {
              let deviceModelCount = data['count'];
              this.numberOfDeviceModels = deviceModelCount;
          },
          error => this.errorMessage = <any>error);
  }

  getListOfDeviceModels(){
    let params = '&name=tenant_id&value=' + this.currentUser.tenant.id;
    this.devicesService.getDeviceModels(params)
    .subscribe(data => {
        let deviceModelList = data['results'];
        if (deviceModelList.length == 0) return;
        let i = 0;
        while (i > this.listOfDeviceModels.length)
        {           
             this.listOfDeviceModels.push('T_' + this.currentUser.tenant.id + '.DM_' + deviceModelList[i].id.toLowerCase());
             i = i + 1;
        }
        console.log(JSON.stringify(deviceModelList));
    })
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