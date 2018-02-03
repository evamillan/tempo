export const main = {
  template: require('./main.template.html'),
  controller($window, Spotify) {
    this.seedTrack = {};
    this.energy = 0;
    this.danceability = 0;
    this.instrumentalness = 0;
    this.valence = 0;
    this.recommendations = {};

    this.getUserTopTracks = function () {
      Spotify.getUserTopTracks({ limit: 15 }).then(data => {
        let topTracks = data.data.items;
        let randomTrack = topTracks[Math.floor(Math.random()*topTracks.length)];
        this.seedTrack = randomTrack;

        this.getTrackAudioFeatures();
      })
      .catch(e => {
        console.log(e.data.error);
        this.loggedIn = false;
      })
    };

    if (localStorage.getItem('spotify-token')) {
      this.getUserTopTracks();
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

    this.getTrackAudioFeatures = function () {
      Spotify.getTrackAudioFeatures(this.seedTrack.id).then(features => {
        this.energy = features.data.energy;
        this.danceability = features.data.danceability;
        this.instrumentalness = features.data.instrumentalness;
        this.valence = features.data.valence;
        console.log(features.data);
        this.getRecommendations();
      });
    };

    this.getRecommendations = function () {
      Spotify.getRecommendations({
        seed_tracks: this.seedTrack.id,
        danceability: this.danceability,
        energy: this.energy,
        instrumentalness: this.instrumentalness,
        valence: this.valence,
        limit: 20
      }).then(data => {
        return this.recommendations = data.data.tracks;
      });
    };
  }
};
