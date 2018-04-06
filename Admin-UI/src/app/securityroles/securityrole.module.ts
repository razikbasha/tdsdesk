import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';




//-- Security Roles

import { SecurityRolesComponent }        from './security-roles.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        SecurityRolesComponent,
        
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers:[]
})
export class SecurityRoleModule{}



    