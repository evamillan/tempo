export const main = {
  template: require('./main.template.html'),
  controller($window, Spotify) {
    if (localStorage.getItem('spotify-token')) {
      this.loggedIn = true;
    };

    $window.onload = function () {
      const hash = $window.location.hash;
      if ($window.location.search.substring(1).indexOf('error') !== -1) {
        // login failure
        $window.close();
      } else if (hash) {
        // login success
        const token = $window.location.hash.split('&')[0].split('=')[1];
        localStorage.setItem('spotify-token', token);
      }
    };

    this.login = function () {
      Spotify.login().then(token => {
        this.loggedIn = true;
        });
    };
  }
};
