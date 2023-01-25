$(document).ready(function () {
  $(document).on("click", ".albumContainer", function () {
    console.log("album selected: " + $(this).attr("data-value"));
    $.post("", { album: $(this).attr("data-value") }, function (album, status) {
      alert(
        album.name +
          "\n" +
          album.total_tracks +
          "\n" +
          album.label +
          "\n" +
          album.release_date +
          "\n" +
          album.copyrights[0].text
      );
      const tracks = album.tracks.items
        .map(function (track) {
          return track.track_number + " " + track.name.toUpperCase();
        })
        .join("\n");
      alert(tracks);
      getAlbumArtwork(album.name, album.images[0].url).then((image) =>
        window.open(image)
      );
    });
  });
});

async function getAlbumArtwork(albumName, albumImage) {
  const url =
    "https://artwork.themoshcrypt.net/api/search?keyword=" +
    encodeURIComponent(albumName);
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach((album) => {
    var diff = resemble(album.artworkUrl100)
      .compareTo(albumImage)
      .ignoreColors()
      .scaleToSameSize()
      .onComplete(function (data) {
        album.matchPercent = data.misMatchPercentage;
      });
  });
  var highestMatch = data.results.sort((a, b) => {
    a.matchPercent > b.matchPercent
      ? 1
      : b.matchPercent > a.matchPercent
      ? -1
      : 0;
  });

  return highestMatch.artworkUrl100
    .replace(/(.*?)\d(.*?)(.*?)thumb\//, "http://a1.mzstatic.com/us/r1000/063/")
    .replace("/100x100bb.jpg", "");
}
