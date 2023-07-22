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

        // Render the dashboard page and pass the user data and top tracks/artists to it
        res.render('dashboard', {
            user: user.body,
            topTracks: topTracks.body.items,
            topArtists: topArtists.body.items,
            trackTimeframe,
            artistTimeframe,
        });
    } catch (error) {
        console.error('Error fetching user data from Spotify:', error.message);
        res.status(500).send('Error fetching user data from Spotify');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
