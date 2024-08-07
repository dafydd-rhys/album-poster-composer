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

export async function addTransparencyToSpotifyCode(imageUrl) {
  const proxyUrl = 'https://corsproxy.io/?'; // Public CORS proxy
  const fullUrl = proxyUrl + encodeURIComponent(imageUrl);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = 'Anonymous'; // Set CORS
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Create a transparent overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Adjust the color and transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get the base64 encoded image
      const base64Image = canvas.toDataURL('image/png');
      resolve(base64Image);
    };

    img.onerror = reject;
    img.src = fullUrl;
  });
}