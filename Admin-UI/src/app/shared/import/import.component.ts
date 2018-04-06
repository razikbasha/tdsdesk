import { NgModule} from '@angular/core';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImportService } from '../../core/import.service';
import { DropzoneDirective, DropzoneComponent, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'import-component',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.css']
})

export class ImportComponent implements OnChanges {  
@Input('importObjectType') importObjectType: string;
@ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;



public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    maxFilesize: 5000,
    acceptedFiles: '.csv, .txt, .xls',
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    method: 'POST',
    paramName: 'fileImport',
    //url: environment.webserverEndpoint + '/upload?iirp-token='+ this.authService.getToken()  + '&qquuid='
    //url: environment.webserverEndpoint + '/upload/submit?iirp-token='+ this.authService.getToken()  + '&qquuid='
    url: environment.webserverEndpoint + '/upload/submit?token='+ this.authService.getToken() 
  };


jsonBody = {};
results:any;
errorMessage:'';
params:string[];

//-- Reactive Form
importForm = new FormGroup({});
//-- Lookups

constructor(private importService:ImportService, private fb:FormBuilder, public authService: AuthService) {
  
}

ngOnInit(){
    this.createForm();
    this.config.url = this.config.url + "&user=" + this.authService.getUserId() + "&tenant=" + this.authService.getCurrentTenantId(); // for now 
}

ngOnChanges() { 
}


createForm() {
    //-- Reactive Form
    this.importForm = this.fb.group({
        importOption: '',
        textImport:'',
        serviceImport:'',
        
    });
}

cancelFileUpload() {}

uploadFile(){}
cancelTextUpload(){}
uploadText() {
    
    const newImport = this.importForm.value;

    let jsonText = JSON.parse(newImport.textImport);
    this.params = [this.importObjectType,jsonText];
    this.importService.import(this.params)
        .subscribe(data => {
            //this.results = data['results'];
            console.log(data);
        },
        error => this.errorMessage = <any>error);

    }

    


    onUploadError(args: any) {
        console.log('onUploadError:', args);
        
      }
    
onUploadSuccess(args: any, fileExtension:string) {
        console.log('onUploadSuccess:', args);
        switch(fileExtension)
        {
            case "csv":
            {
                return;
            }
            case "excel":
            {
                return;
            }

        }
       
        
    }    
}

