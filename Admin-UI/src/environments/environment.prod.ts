export const environment = {
  production: true,
  configEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=d97a3ae7-8f2f-4789-9f61-62b5a2ef6ce5',
  apiEndpoint: 'https://api.iotworldlabs.io/iirp/?guid=d97a3ae7-8f2f-4789-9f61-62b5a2ef6ce5',
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
