export async function fetchAlbumDetails(albumId) {
    const url = `https://api.example.com/albums/${albumId}`; // Replace with actual URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

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
        .replace(/(.*?)\d(.*?)(.*?)thumb\//, "http://a1.mzstatic.com/us/r1000/063/")
        .replace("/100x100bb.jpg", "");
}