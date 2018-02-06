export default config;

/** @ngInject */
function config($stateProvider, $urlRouterProvider, $locationProvider, SpotifyProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      component: 'app'
    });

switch (window.location.hostname) {
    case 'localhost':
    SpotifyProvider.setRedirectUri('http://localhost:8080/');

    break;

    default:
    SpotifyProvider.setRedirectUri('https://evamillan.github.io/tempo');
};

  SpotifyProvider.setClientId('c456e69c7bb64cbb86929d493532d27d');
  SpotifyProvider.setScope('user-top-read playlist-read-private playlist-modify-public');
  SpotifyProvider.setAuthToken(localStorage.getItem('spotify-token'));
}
