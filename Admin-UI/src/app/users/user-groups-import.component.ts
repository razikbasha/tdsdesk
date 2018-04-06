
import { Component, Input, OnChanges } from '@angular/core';
import { AppComponent }  from '../app.component';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'user-groups-import',
    templateUrl: './user-groups-import.component.html'
})



export class UserGroupsImportComponent implements OnChanges {
  
ngOnInit(){

}

ngOnChanges() { 

}


}