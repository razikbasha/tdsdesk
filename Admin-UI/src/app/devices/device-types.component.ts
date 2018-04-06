import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//-- Data Models
import { DeviceType } from '../data-models/device';
import { Tenant } from '../data-models/tenant';
import { User } from '../data-models/user';

//-- Services
import { AuthService } from '../core/auth.service';
import { DevicesService } from '../core/devices.service';

@Component ({
    selector: 'devicestypes-list',
    templateUrl: './device-types.component.html',
    styleUrls: ['./device-types.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DevicesTypesComponent implements OnInit {

    currentUser:User = new User();
    currentTenant:Tenant;

    listOfDevicesTypes: DeviceType[];
    errorMessage: string;
    
    // -- Inject HttpClient into your component or service
    constructor(private router: Router, private http: HttpClient, private authService:AuthService, private devicesService:DevicesService) {}
    
    
    ngOnInit(): void {
        window.dispatchEvent(new CustomEvent('device-types-ready'));

        if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
        
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            if (this.isSuperAdmin()) 
                this.getDeviceTypes('');
            else
            {
                this.getDeviceTypes('&name=tenant_id&value=' + this.currentUser.tenant? this.currentUser.tenant.id:'');
            }

        });
    }
    
    isSuperAdmin():boolean
    {
        return this.currentUser.security_role == 'Super Admin';
    }
    

    getDeviceTypes(params:string) {
        this.devicesService.getDeviceTypes(params)
            .subscribe(data => {
                    this.listOfDevicesTypes = data['results'];
                },
                error => this.errorMessage = <any>error);
        
    }
    /**
     * User-defined Methods
     ****************************/
    
    loadDeviceTypeDetailsPage(param:string)
    {
        this.router.navigate(['devicetypes/' + param]);
    }
    
    loadDeviceTypeNewPage() {
        this.router.navigate(['devicetypes/new']);
    }
    
    loadDeviceTypeImportPage() {
        this.router.navigate(['devicetypes/import']);
    }
    
}
