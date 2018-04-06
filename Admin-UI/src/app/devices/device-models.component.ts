import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';

//-- Data Models
import { DeviceModel } from '../data-models/device';
import { User }        from '../data-models/user';
import { Usecase }      from '../data-models/usecase';
import { Tenant }       from '../data-models/tenant';

//-- Services
import { DevicesService } from '../core/devices.service';
import { AuthService } from '../core/auth.service';

@Component ({
    selector: 'devices-models',
    templateUrl: './device-models.component.html',
    styleUrls: ['./device-models.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DeviceModelsComponent implements OnInit {
    @Input()
    currentUser:User = new User();
    currentTenant:Tenant;

    listOfDeviceModels: DeviceModel[];
    errorMessage: string;
    
    //-- Inject HttpClient into your component or service
    constructor(private router: Router, private devicesService: DevicesService, private authService:AuthService) {}

    ngOnInit() {


        if (!this.authService.isAuthenticated())
        {
            this.router.navigate(['dashboard']);
            return;
        } 
        
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (this.isSuperAdmin())
                this.getDeviceModels('');
            else
            {
                this.getDeviceModels('&name=tenant_id&value=' + (this.currentUser.tenant? this.currentUser.tenant.id:''));
            }

        });
    }

    isSuperAdmin():boolean
    {
        return this.currentUser.security_role == 'Super Admin';
    }
   
    getDeviceModels(params:string) {
        this.devicesService.getDeviceModels(params)
            .subscribe(data => {
                    let listOfDeviceModels = data['results'];
                    this.listOfDeviceModels = listOfDeviceModels

                     window.dispatchEvent(new CustomEvent('device-models-ready'));
                },
                error => this.errorMessage = <any>error);
        
    }
    loadDeviceModelDetailsPage(param:string)
    {
        this.router.navigate(['devicemodels/' + param]);
    }
    
    loadDeviceNewPage() {
        this.router.navigate(['devicemodels/new']);
    }

    loadDeviceImportPage() {
        this.router.navigate(['devicemodels/import']);
    }

}