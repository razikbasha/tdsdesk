import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent }  from '../app.component';

//-- Data Models
import { DeviceModel } from '../data-models/device';
import { User }        from '../data-models/user';
import { Usecase }      from '../data-models/usecase';
import { Tenant }       from '../data-models/tenant';

//-- Services
import { DevicesService } from '../core/devices.service';
import { AuthService } from '../core/auth.service';
@Component({
  selector: 'device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
 
  currentUser:User = new User();
  currentTenant:Tenant;

  listOfDeviceModels: DeviceModel[];
  errorMessage: string;
  
  constructor(private router: Router, private devicesService: DevicesService, private authService:AuthService) { }

  ngOnInit() {

    if (!this.authService.isAuthenticated()) this.router.navigate(['dashboard']);
    
    this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        if (this.isSuperAdmin()) 
            this.getDeviceModels('');
        else
        {
            this.getDeviceModels('&name=tenant_id&value=' + this.currentUser.tenant? this.currentUser.tenant.id : '');
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
                let deviceModels = data['results'];
                this.listOfDeviceModels = deviceModels;
            },
            error => this.errorMessage = <any>error);
    
}

}
