import { NgModule, InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
  webApiEndpoint: string;
  auth0: {
      clientID: string;
  }
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'http://localhost:8000/api/v1',
  webApiEndpoint: 'http://localhost:8080',
  auth0: {
      clientID: '5hzANeHAfFubEnWVynS3vFGXK2sCMlv7'
  }
};

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }