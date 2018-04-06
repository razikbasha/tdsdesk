import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AppComponent }  from '../app.component';
import {  UserGroup,User } from '../data-models/user';
import { SecurityRoles } from '../data-models/security-role';
import { UsersService } from '../core/users.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'user-groups-new',
    templateUrl: './user-groups-new.component.html',
    styleUrls: ['./user-groups-new.component.css']
})

export class UserGroupsNewComponent implements OnInit {
    @Input() organization:string;

    listOfUserGroups: UserGroup[];
    userGroup = UserGroup;
    currentUser:User;
    
    
        loadUserGroupsNewPage() {
            this.router.navigate(['usergroups/new']);
        }

    //-- Reactive Form
    userGroupsNewForm = new FormGroup({});

        //-- Lookups
    allSercurityRoles = SecurityRoles;
    usersSecurityRoles = SecurityRoles;

    constructor(private app: AppComponent, 
                private router: Router, 
                private fb:FormBuilder,
                private usersService: UsersService,
                private authService: AuthService) {
        app.setPageContentFullWidth(false);
        this.createForm();
    }

    ngOnInit() {
        window.dispatchEvent(new CustomEvent('user-groups-new-ready'));

        if (!this.authService.isAuthenticated()) this.router.navigate(['login']);
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;

            if (!this.isSuperAdmin())
              this.usersSecurityRoles =  this.allSercurityRoles.filter( role=> {
                    return (!role.includes("Super Admin"))
                });
            }
        );

    }
    isSuperAdmin():boolean
    {
        return this.currentUser.security_role == "Super Admin";
    }

    createForm(){
        this.userGroupsNewForm = this.fb.group({
            userGroupName:'',
            userSecurityRole:''
        })
    }

    saveNewUserGroup() {

        const updatedUserGroup = this.userGroupsNewForm.value;
        let userGroupId = updatedUserGroup.userGroupName;

        let currentDate = new Date();
        let createdDate = new Date();
        let createdBy = '';
        const body = {
            id: userGroupId,
            name: updatedUserGroup.userGroupName,
            organization: this.organization || 'D4DT',
            security_role: updatedUserGroup.userSecurityRole,

            time_created: new Date(),
            time_updated: new Date(),
            created_by: '',
            updated_by: ''
        };

        let saveDoc = {
            id: userGroupId,
            jsonBody: JSON.stringify(body)
        };

        //-- Save updated `User`
        console.log('Saves updated `User` %j', this.usersService.saveNewOrUpdatedUserGroup(saveDoc));

        this.router.navigate(['usergroups']);
    }
}
