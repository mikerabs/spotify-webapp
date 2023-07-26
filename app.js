const express = require('express');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Include the necessary Spotify Web API library
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '7b4eeac99ef14ba09df235a196f20903',
    clientSecret: '005d5ea9d25349cd99ca94ac27a81a23',
    redirectUri: 'http://localhost:3000/callback'
});

// app.js

// ...
const path = require('path');
// ...

// Set the 'public' folder as the static directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the "public" directory, including search.js
app.use(express.static('public'));


// Home page route
app.get('/', (req, res) => {
    res.render('index'); // Render the index.html file
});

// Redirect to Spotify authorization URL
app.get('/login', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-top-read']; // Add additional scopes as needed
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeURL);
});

// Spotify authorization callback route
app.get('/callback', async (req, res) => {
    const { code } = req.query; // Get the authorization code from the query parameters
    try {
        // Exchange the authorization code for an access token and refresh token
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;

        // Set the access token on the Spotify Web API instance
        spotifyApi.setAccessToken(access_token);

        // Save the refresh token for future use (e.g., token refreshing)
        // Implement a mechanism to store the refresh token securely (e.g., in a database)
        // For simplicity, we'll just log it here.
        console.log('Refresh Token:', refresh_token);

        // Redirect the user to a page that displays their Spotify data
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error exchanging authorization code:', error.message);
        res.status(500).send('Error exchanging authorization code');
    }
});

// Dashboard route
app.get('/dashboard', async (req, res) => {
    try {
        // Use the access token to make requests to the Spotify API on behalf of the user
        const user = await spotifyApi.getMe();

        // Log the user object to the console for debugging
        console.log('User:', user);

        // Get the selected timeframes from the query parameters (default to 'short_term')
        const trackTimeframe = req.query['track-timeframe'] || 'short_term';
        const artistTimeframe = req.query['artist-timeframe'] || 'short_term';


        //log each trackTimeframe and artistTimeframe to the console for debugging
        console.log('trackTimeframe:', trackTimeframe);
        console.log('artistTimeframe:', artistTimeframe);

        // Use the access token to make requests to the Spotify API on behalf of the user
        const topTracks = await spotifyApi.getMyTopTracks({ limit: 10, time_range: trackTimeframe });
        const topArtists = await spotifyApi.getMyTopArtists({ limit: 10, time_range: artistTimeframe });

        // Create arrays to store track album covers and artist images
        const trackAlbumCovers = [];
        const artistImages = [];

        // Fetch album covers for top tracks
        for (const track of topTracks.body.items) {
            // Fetch the track details to get the album cover
            const trackDetails = await spotifyApi.getTrack(track.id);
            const albumCover = trackDetails.body.album.images[0].url;
            trackAlbumCovers.push(albumCover);
        }

        // Fetch images for top artists
        for (const artist of topArtists.body.items) {
            // Fetch the artist details to get the image
            const artistDetails = await spotifyApi.getArtist(artist.id);
            const artistImage = artistDetails.body.images[0].url;
            artistImages.push(artistImage);
        }

        // Render the dashboard page and pass the user data and top tracks/artists to it
        res.render('dashboard', {
            user: user.body,
            topTracks: topTracks.body.items,
            topArtists: topArtists.body.items,
            trackTimeframe,
            artistTimeframe,
            trackAlbumCovers,
            artistImages,
        });
    } catch (error) {
        console.error('Error fetching user data from Spotify:', error.message);
        res.status(500).send('Error fetching user data from Spotify');
    }
});

// Search route
app.get('/search', async (req, res) => {
    const query = req.query.q;
    const type = req.query.type;
    
    try {
        // Use the spotifyApi object to search based on the selected type
        const data = await spotifyApi.search(query, [type]);
        res.json(data.body);
    } catch (error) {
        console.error('Error searching:', error.message);
        res.status(500).json({ error: 'Error searching' });
    }
});

// Custom Recommendations route
// app.get('/custom-recommendations', async (req, res) => {
//     const playlistSize = req.query.playlistSize;
//     const market = req.query.market;
//     const seedGenres = req.query.seedGenres.split(',');

//     try {
//         // Use the spotifyApi object to get custom recommendations based on the user's input
//         const response = await spotifyApi.getRecommendations({
//             limit: playlistSize,
//             market: market,
//             seed_genres: seedGenres,
//             // Add other optional parameters here if needed
//         });

//         // Send the recommendations data back to the client
//         res.json(response.body.tracks);
//     } catch (error) {
//         console.error('Error fetching custom recommendations:', error);
//         res.status(500).json({ error: 'Error fetching custom recommendations' });
//     }
// });
app.post('/custom-recommendations', async (req, res) => {
    try {
        const {
            limit,
            market,
            seed_artists,
            seed_genres,
            seed_tracks,
            acousticness_min,
            acousticness_max,
            acousticness_target,
            danceability_min,
            danceability_max,
            danceability_target,
            duration_ms_min,
            duration_ms_max,
            duration_ms_target,
            energy_min,
            energy_max,
            energy_target,
            instrumentalness_min,
            instrumentalness_max,
            instrumentalness_target,
            key_min,
            key_max,
            key_target,
            liveness_min,
            liveness_max,
            liveness_target,
            loudness_min,
            loudness_max,
            loudness_target,
            mode_min,
            mode_max,
            mode_target,
            popularity_min,
            popularity_max,
            popularity_target,
            speechiness_min,
            speechiness_max,
            speechiness_target,
            tempo_min,
            tempo_max,
            tempo_target,
            time_signature_min,
            time_signature_max,
            time_signature_target,
            valence_min,
            valence_max,
            valence_target,
        } = req.body;

        // Set the access token for the Spotify Web API object (you need to obtain the token through the Spotify authorization process)
        spotifyApi.setAccessToken(req.session.access_token);

        // Create the parameters object for the recommendations request
        const params = {
            limit,
            market,
            seed_artists,
            seed_genres,
            seed_tracks,
            min_acousticness: acousticness_min,
            max_acousticness: acousticness_max,
            target_acousticness: acousticness_target,
            min_danceability: danceability_min,
            max_danceability: danceability_max,
            target_danceability: danceability_target,
            min_duration_ms: duration_ms_min,
            max_duration_ms: duration_ms_max,
            target_duration_ms: duration_ms_target,
            min_energy: energy_min,
            max_energy: energy_max,
            target_energy: energy_target,
            min_instrumentalness: instrumentalness_min,
            max_instrumentalness: instrumentalness_max,
            target_instrumentalness: instrumentalness_target,
            min_key: key_min,
            max_key: key_max,
            target_key: key_target,
            min_liveness: liveness_min,
            max_liveness: liveness_max,
            target_liveness: liveness_target,
            min_loudness: loudness_min,
            max_loudness: loudness_max,
            target_loudness: loudness_target,
            min_mode: mode_min,
            max_mode: mode_max,
            target_mode: mode_target,
            min_popularity: popularity_min,
            max_popularity: popularity_max,
            target_popularity: popularity_target,
            min_speechiness: speechiness_min,
            max_speechiness: speechiness_max,
            target_speechiness: speechiness_target,
            min_tempo: tempo_min,
            max_tempo: tempo_max,
            target_tempo: tempo_target,
            min_time_signature: time_signature_min,
            max_time_signature: time_signature_max,
            target_time_signature: time_signature_target,
            min_valence: valence_min,
            max_valence: valence_max,
            target_valence: valence_target,
        };

        // Call the Spotify API to get custom recommendations
        const { body } = await spotifyApi.getRecommendations(params);

        // Extract the necessary information (name and artists) from the recommendations
        const customRecommendations = body.tracks.map((track) => ({
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
        }));

        // Send the custom recommendations back to the client
        res.status(200).json(customRecommendations);
    } catch (error) {
        console.error('Error fetching custom recommendations:', error);
        res.status(500).json({ error: 'Error fetching custom recommendations' });
    }
});

  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
