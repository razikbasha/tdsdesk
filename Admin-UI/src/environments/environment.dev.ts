// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    configEndpoint: 'https://devdata.d4dt.io/iirp/?guid=cba41fd7-af30-429c-9d47-084f15ed82b8',
    apiEndpoint: 'https://devdata.d4dt.io/iirp/?guid=cba41fd7-af30-429c-9d47-084f15ed82b8',
    webserverEndpoint: '',
    imageEndpoint: '/iirp-tenant-set1',
    auth:{
      clientID: '5hzANeHAfFubEnWVynS3vFGXK2sCMlv7',
      domain: 'd4dt.auth0.com',
      responseType: 'token id_token',
      audience: 'https://d4dt.auth0.com/userinfo',
      redirectUri: 'https://' + location.host + '/callback',
      scope: 'openid profile email',
      CONNECTION_USERNAME_PASSWORD_AUTH: 'Username-Password-Authentication'
  
    }
  };
  