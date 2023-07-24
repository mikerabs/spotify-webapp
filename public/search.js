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
