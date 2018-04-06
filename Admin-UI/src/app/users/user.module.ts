import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';

import { UsersComponent }           from './users.component';
import { UserDetailsComponent }     from './user-details.component';
import { UserProfileComponent }     from './user-profile.component';

import { UserGroupsComponent }      from './user-groups.component';
import { UserGroupsNewComponent }   from './user-groups-new.component';


@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        UsersComponent,
        UserDetailsComponent,
        
        UserGroupsComponent,
        UserGroupsNewComponent,
        UserProfileComponent,

    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers:[]
})
export class UserModule{}
