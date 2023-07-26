$(document).ready(function () {
    // Configure the search bar using Select2
    $('#search-bar').select2({
        placeholder: 'Enter your search term',
        minimumInputLength: 2,
        ajax: {
            url: '/search',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term, // search term
                    type: $('#search-type').val() // search type - track, artist, album, playlist, etc.
                };
            },
            processResults: function (data) {
                // return {
                //     results: data.tracks.items.map(item => {
                //         const text = $('#search-type').val() === 'track' ? `${item.name} by ${item.artists[0].name}` : item.name;
                //         return {
                //             id: item.id,
                //             text: text
                //         };
                //     })
                // };
                let items = [];
                if ($('#search-type').val() === 'track') {
                    items = data.tracks.items;
                } 
                else if ($('#search-type').val() === 'artist') {
                    items = data.artists.items;
                }
                else if ($('#search-type').val() === 'album') {
                    items = data.albums.items;
                }
                else if ($('#search-type').val() === 'playlist') {
                    items = data.playlists.items;
                }
                else if ($('#search-type').val() === 'show') {
                    items = data.shows.items;
                }
                else if ($('#search-type').val() === 'episode') {
                    items = data.episodes.items;
                }
                else if ($('#search-type').val() === 'audiobook') {
                    items = data.audiobooks.items;
                }

                return {
                    results: items.map(item => {
                        const text = $('#search-type').val() === 'track'
                            ? `${item.name} by ${item.artists[0].name}`
                            : item.name;

                        return {
                            id: item.id,
                            text: text
                        };
                    })
                };
            },
            cache: true
        },
    });

    // Show detailed info when a result is selected
    $('#search-bar').on('select2:select', function (e) {
        const data = e.params.data;
        $('#detail-name').text(`Name: ${data.text}`);
        $('#detail-spotify-id').text(`Spotify ID: ${data.id}`);
        $('#detailed-info').show();
    });

    // Clear detailed info when the selection is cleared
    $('#search-bar').on('select2:unselect', function (e) {
        $('#detailed-info').hide();
    });
});


async function handleCustomRecommendations() {
    const playlistSize = document.getElementById('playlist-size').value;
    const market = document.getElementById('market').value;
    const seedArtists = document.getElementById('seed-artists').value;
    const seedGenres = document.getElementById('seed-genres').value;
    const seedTracks = document.getElementById('seed-tracks').value;
    const minAcousticness = document.getElementById('min-acousticness').value;
    const maxAcousticness = document.getElementById('max-acousticness').value;
    const targetAcousticness = document.getElementById('target-acousticness').value;
    const minDanceability = document.getElementById('min-danceability').value;
    const maxDanceability = document.getElementById('max-danceability').value;
    const targetDanceability = document.getElementById('target-danceability').value;
    const minDurationMs = document.getElementById('min-duration-ms').value;
    const maxDurationMs = document.getElementById('max-duration-ms').value;
    const targetDurationMs = document.getElementById('target-duration-ms').value;
    const minEnergy = document.getElementById('min-energy').value;
    const maxEnergy = document.getElementById('max-energy').value;
    const targetEnergy = document.getElementById('target-energy').value;
    const minInstrumentalness = document.getElementById('min-instrumentalness').value;
    const maxInstrumentalness = document.getElementById('max-instrumentalness').value;
    const targetInstrumentalness = document.getElementById('target-instrumentalness').value;
    const minKey = document.getElementById('min-key').value;
    const maxKey = document.getElementById('max-key').value;
    const targetKey = document.getElementById('target-key').value;
    const minLiveness = document.getElementById('min-liveness').value;
    const maxLiveness = document.getElementById('max-liveness').value;
    const targetLiveness = document.getElementById('target-liveness').value;
    const minLoudness = document.getElementById('min-loudness').value;
    const maxLoudness = document.getElementById('max-loudness').value;
    const targetLoudness = document.getElementById('target-loudness').value;
    const minMode = document.getElementById('min-mode').value;
    const maxMode = document.getElementById('max-mode').value;
    const targetMode = document.getElementById('target-mode').value;
    const minPopularity = document.getElementById('min-popularity').value;
    const maxPopularity = document.getElementById('max-popularity').value;
    const targetPopularity = document.getElementById('target-popularity').value;
    const minSpeechiness = document.getElementById('min-speechiness').value;
    const maxSpeechiness = document.getElementById('max-speechiness').value;
    const targetSpeechiness = document.getElementById('target-speechiness').value;
    const minTempo = document.getElementById('min-tempo').value;
    const maxTempo = document.getElementById('max-tempo').value;
    const targetTempo = document.getElementById('target-tempo').value;
    const minTimeSignature = document.getElementById('min-time-signature').value;
    const maxTimeSignature = document.getElementById('max-time-signature').value;
    const targetTimeSignature = document.getElementById('target-time-signature').value;
    const minValence = document.getElementById('min-valence').value;
    const maxValence = document.getElementById('max-valence').value;
    const targetValence = document.getElementById('target-valence').value;
  
    // Create the parameters object for the recommendations request
    const params = {
      limit: playlistSize,
      market: market,
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      seed_tracks: seedTracks,
      min_acousticness: minAcousticness,
      max_acousticness: maxAcousticness,
      target_acousticness: targetAcousticness,
      min_danceability: minDanceability,
      max_danceability: maxDanceability,
      target_danceability: targetDanceability,
      min_duration_ms: minDurationMs,
      max_duration_ms: maxDurationMs,
      target_duration_ms: targetDurationMs,
      min_energy: minEnergy,
      max_energy: maxEnergy,
      target_energy: targetEnergy,
      min_instrumentalness: minInstrumentalness,
      max_instrumentalness: maxInstrumentalness,
      target_instrumentalness: targetInstrumentalness,
      min_key: minKey,
      max_key: maxKey,
      target_key: targetKey,
      min_liveness: minLiveness,
      max_liveness: maxLiveness,
      target_liveness: targetLiveness,
      min_loudness: minLoudness,
      max_loudness: maxLoudness,
      target_loudness: targetLoudness,
      min_mode: minMode,
      max_mode: maxMode,
      target_mode: targetMode,
      min_popularity: minPopularity,
      max_popularity: maxPopularity,
      target_popularity: targetPopularity,
      min_speechiness: minSpeechiness,
      max_speechiness: maxSpeechiness,
      target_speechiness: targetSpeechiness,
      min_tempo: minTempo,
      max_tempo: maxTempo,
      target_tempo: targetTempo,
      min_time_signature: minTimeSignature,
      max_time_signature: maxTimeSignature,
      target_time_signature: targetTimeSignature,
      min_valence: minValence,
      max_valence: maxValence,
      target_valence: targetValence,
    };
  
    // Send the custom recommendations request to the server
    try {
      const response = await fetch('/custom-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
  
      if (!response.ok) {
        throw new Error('Error fetching custom recommendations.');
      }
  
      const data = await response.json();
  
      // Render the custom recommendations on the page
      const recommendationsResultsDiv = document.getElementById('custom-recommendations-results');
      recommendationsResultsDiv.innerHTML = '';
  
      data.forEach((track) => {
        recommendationsResultsDiv.innerHTML += `<p>${track.name} - ${track.artists[0].name}</p>`;
      });
    } catch (error) {
      console.error('Error fetching custom recommendations:', error.message);
    }
  }
  

// Event listener for the "Get Recommendations" button
// document.getElementById('get-recommendations-button').addEventListener('click', handleCustomRecommendations);// (Update other functions for the remaining parameters)

document.getElementById('get-recommendations-button').addEventListener('click', async () => {
    const acousticnessRange = document.getElementById('acousticness-range');
    const acousticnessTarget = document.getElementById('acousticness-target');

    // Collect values for other parameters (following the same pattern as before)

    // Build the API call with the collected parameter values
    const response = await fetch('/custom-recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            acousticness: { min: acousticnessRange.min, max: acousticnessRange.max, target: acousticnessTarget.value },
            // (Add other parameters here)
        })
    });

    // Handle the API response and display recommendations
});