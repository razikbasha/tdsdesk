// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=demo` then `environment.demo.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    configEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=1e4da897-d6a6-4edc-8877-f0a706774457',
    apiEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=1e4da897-d6a6-4edc-8877-f0a706774457',
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
  