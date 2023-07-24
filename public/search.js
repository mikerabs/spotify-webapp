document.addEventListener('DOMContentLoaded', () => {
    // Function to handle the search
    async function handleSearch() {
        const searchTerm = document.getElementById('search-term').value;
        const searchType = document.getElementById('search-type').value;

        try {
            // Make an API call to your server to perform the search
            const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`);
            const data = await response.json();

            // Render the search results on the page
            const searchResultsDiv = document.getElementById('search-results');
            searchResultsDiv.innerHTML = '';

            if (searchType === 'track') {
                data.tracks.items.forEach(track => {
                    searchResultsDiv.innerHTML += `<p>${track.name} - ${track.artists[0].name}</p>`;
                });
            } else if (searchType === 'artist') {
                data.artists.items.forEach(artist => {
                    searchResultsDiv.innerHTML += `<p>${artist.name}</p>`;
                });
            } else if (searchType === 'album') {
                data.albums.items.forEach(album => {
                    searchResultsDiv.innerHTML += `<p>${album.name} - ${album.artists[0].name}</p>`;
                });
            } else if (searchType === 'playlist') {
                data.playlists.items.forEach(playlist => {
                    searchResultsDiv.innerHTML += `<p>${playlist.name}</p>`;
                });
            } else if (searchType === 'show') {
                data.shows.items.forEach(show => {
                    searchResultsDiv.innerHTML += `<p>${show.name}</p>`;
                });
            } else if (searchType === 'episode') {
                data.episodes.items.forEach(episode => {
                    searchResultsDiv.innerHTML += `<p>${episode.name} - ${episode.show.name}</p>`;
                });
            } else if (searchType === 'audiobook') {
                data.audiobooks.items.forEach(audiobook => {
                    searchResultsDiv.innerHTML += `<p>${audiobook.name}</p>`;
                });
            }

        } catch (error) {
            console.error('Error performing search:', error);
        }
    }

    // Event listener for the search button
    document.getElementById('search-button').addEventListener('click', handleSearch);
});