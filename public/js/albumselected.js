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
      getAlbumArtwork(album.name, album.artists[0].name).then((image) =>
        window.open(image)
      );
    });
  });
});

async function getAlbumArtwork(albumName, artistName) {
  const url =
    "https://artwork.themoshcrypt.net/api/search?keyword=" +
    encodeURIComponent(albumName);
  const response = await fetch(url);
  const data = await response.json();

  console.log("Requested " + albumName + " from " + artistName);
  const highestMatch = data.results.find(
    (album) =>
      album.collectionName.toUpperCase() == albumName.toUpperCase() &&
      album.artistName.toUpperCase() == artistName.toUpperCase()
  );
  console.log("Found " + highestMatch.collectionName);

  return highestMatch.artworkUrl100
    .replace(/(.*?)\d(.*?)(.*?)thumb\//, "http://a1.mzstatic.com/us/r1000/063/")
    .replace("/100x100bb.jpg", "");
}
