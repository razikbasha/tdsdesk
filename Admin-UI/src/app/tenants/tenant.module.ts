import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { DropzoneComponent , DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';

//-- Tenants
import { TenantsComponent }         from './tenants.component';
import { TenantDetailsComponent }   from './tenant-details.component';

import { OrganizationsComponent }       from './organizations.component';
import { OrganizationsImportComponent } from './organizations-import.component';
import { OrganizationDetailsComponent } from './organization-details.component';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
   // url:location.host.includes('localhost')? 'http://localhost:8080/upload?qquuid=': 'https://d4dt.io/upload?qquuid=',
   url:  'https://d4dt.io/upload/submit',
   maxFilesize: 5000,
    acceptedFiles: 'image/*'
  };

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DropzoneModule.forRoot(DROPZONE_CONFIG)
        
    ],
    declarations: [

        TenantsComponent,
        TenantDetailsComponent,

        OrganizationsComponent,
        OrganizationDetailsComponent,

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers:[]
})
export class TenantModule{}
