export const main = {
  template: require('./main.template.html'),
  controller($window, Spotify) {
    this.seedTrack = {};
    this.userID = '';
    this.energy = 0;
    this.danceability = 0;
    this.instrumentalness = 0;
    this.valence = 0;
    this.recommendations = {};
    this.searchResults = [];
    this.playlistCreated = false;

    this.getUserTopTracks = () => {
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

    this.getUserID = () => {
      Spotify.getCurrentUser().then(data => this.userID = data.data.id)
    };

    if (localStorage.getItem('spotify-token')) {
      this.getUserTopTracks();
      this.getUserID();
      this.loggedIn = true;
    };

    $window.onload = () => {
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

    this.login = () => {
      Spotify.login().then(token => {
        this.getUserTopTracks();
        this.getUserID();
        this.loggedIn = true;
        });
    };

    this.getTrackAudioFeatures = () => {
      Spotify.getTrackAudioFeatures(this.seedTrack.id).then(features => {
        this.energy = features.data.energy;
        this.danceability = features.data.danceability;
        this.instrumentalness = features.data.instrumentalness;
        this.valence = features.data.valence;

        this.getRecommendations();
      });
    };

    this.getRecommendations = () => {
      this.playlistCreated = false;

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

    this.search = (value) => {
      Spotify.search(value, 'track', {limit: 5}).then(data => {
        this.searchResults = data.data.tracks.items;
      });
    };

    this.setSeedTrack = (track) => {
      this.seedTrack = track;
      this.searchResults = [];
      this.searchTrack = "";

      this.getTrackAudioFeatures();
      this.getRecommendations();
    };

    this.createPlaylist = () => {
      Spotify.createPlaylist(this.userID, {name: 'Not my tempo'}).then(response => {
        const playlistID = response.data.id;
        let tracksUris = this.recommendations.map(track => {
          return track.uri;
        });

        Spotify.addPlaylistTracks(this.userID, playlistID, tracksUris)
               .then(response => this.playlistCreated = true)
      })
    }
  }
};
