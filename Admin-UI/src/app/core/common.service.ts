
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { CommonLookup, Group, UseCaseType, CodeNamePair, StatesOrProvincesPerCountry, Countries} from '../data-models/common'

@Injectable()
export class CommonService implements OnInit {
    
    commonLookup: Observable<any>;
    private apiURI = environment.apiEndpoint;
    private commonLookupsEndpoint = this.apiURI + '&a=find&ot=CommonLookups';
    private groupsEndPoint = this.apiURI + '&a=find&ot=Group&name=type&value=';
    private getUseCaseTypesEndpoint = this.apiURI + '&a=find&ot=UseCaseType';
    
    //-- Inject HttpClient into your component or service
    constructor(private http: HttpClient) {
    }
    
    ngOnInit(): void {
        
    }
    
    
    getCountryList():CodeNamePair[]{
        return Countries;
    }

    getStateByCountry(country:string):CodeNamePair[]{
        let states:CodeNamePair[];
        
        let countries = StatesOrProvincesPerCountry.filter( state =>{
            return (state.country == country)
        });
        if (countries && countries[0])
            return countries[0].states;
        return [];

    }
    
    /*****
     * GET Common Lookups
     ************************************/
    getCommonLookups(): Observable<CommonLookup[]> {
        
        return this.http.get<CommonLookup[]>(this.commonLookupsEndpoint)
            //.do (data => console.log(JSON.stringify(data)))
            .catch (this.handleError);
    }
    

    getIndustries(): Observable<Group[]> {
        
        return this.http.get<Group[]>(this.groupsEndPoint + 'industry')
           // .do (data => console.log(JSON.stringify(data)))
            .catch (this.handleError);
    }

    getUseCaseTypes():Observable<any[]>{
        return this.http.get<any[]>(this.getUseCaseTypesEndpoint)
        //.do (data => console.log(JSON.stringify(data)))
        .catch (this.handleError);
    }
    

    /*****
     * Common Function: HandleError
     ************************************/
    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
    
}