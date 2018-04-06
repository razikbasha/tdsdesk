import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { DropzoneDirective, DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


import { DeviceModelsComponent }             from './device-models.component';
import { DeviceModelDetailsComponent }   from './device-model-details.component';
import { DevicesTypesComponent }        from './device-types.component';
import { DevicesTypeDetailsComponent }  from './device-type-details.component';
import { DeviceComponent } from './device.component';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DropzoneModule
    ],
    declarations: [

        DeviceModelsComponent,
        DeviceModelDetailsComponent,
        DevicesTypesComponent,
        DevicesTypeDetailsComponent,
        DeviceComponent,

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers:[]
})
export class DeviceModule{}



    