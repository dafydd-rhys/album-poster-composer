export async function getAlbumArtwork(albumName, artistName, albumThumbnail) {
    const url = "https://itunes.apple.com/search?term=" + encodeURIComponent(albumName);
    const response = await fetch(url);
    const data = await response.json();

    var highestMatch = data.results.find(album => 
        album.collectionName.toUpperCase() === albumName.toUpperCase() && 
        album.artistName.toUpperCase() === artistName.toUpperCase()
    );

    if (highestMatch === undefined) {
        data.results.forEach(album => {
            var diff = resemble(albumThumbnail)
                .compareTo(album.artworkUrl100)
                .scaleToSameSize()
                .ignoreColors()
                .onComplete(data => {
                    album.matchPercent = 100 - data.rawMisMatchPercentage;
                });
        });
        data.results.sort((a, b) => b.matchPercent - a.matchPercent);
        highestMatch = data.results[0];
    }

    return highestMatch.artworkUrl100
