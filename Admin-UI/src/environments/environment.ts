// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,configEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=d97a3ae7-8f2f-4789-9f61-62b5a2ef6ce5',
  apiEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=d97a3ae7-8f2f-4789-9f61-62b5a2ef6ce5',
  //webserverEndpoint: location.host.includes('localhost')? 'http://localhost:8080': '',
  webserverEndpoint: 'https://d4dt.io',
  imageEndpoint: '/iirp-tenant-set1',
  auth:{
    clientID: '5hzANeHAfFubEnWVynS3vFGXK2sCMlv7',
    domain: 'd4dt.auth0.com',
    responseType: 'token id_token',
    audience: 'https://d4dt.auth0.com/userinfo',
    redirectUri: location.host.includes('localhost')? 'http://localhost:4200/callback': 'https://' + location.host + '/callback',
    scope: 'openid profile email',
    CONNECTION_USERNAME_PASSWORD_AUTH: 'Username-Password-Authentication'

  }
};
