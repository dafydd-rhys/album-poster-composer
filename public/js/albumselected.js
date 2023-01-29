$(document).ready(function () {
  $(document).on("click", ".albumContainer", function () {
    const albumContainer = $(this);
    console.log("album selected: " + albumContainer.attr("data-value"));
    $.post(
      "",
      { album: albumContainer.attr("data-value") },
      function (album, status) {
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

        const swatches = getImageColourPalette(
          albumContainer.children("img:first").get(0)
        );
        
        var artworkColours = [];

        for (var swatch in swatches) {
          if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
            console.log(swatches[swatch].getHex());
            artworkColours.push(swatches[swatch].getHex());
          }
        }

        getAlbumArtwork(
          album.name,
          album.artists[0].name,
          album.images[0].url
        ).then(function (image) {
          var w = window.open("poster_v1.html");
          w.addEventListener("load", function () {
            //ARTWORK
            w.document.getElementById("albumCover").src = image;
            
            //RELEASED BY
            w.document.getElementById("albumReleasedBy").innerHTML = "AN ALBUM BY " + album.artists[0].name.toUpperCase();
            
            //ARTIST AND ALBUM NAME
            w.document.getElementById("albumArtistAndName").innerHTML = album.artists[0].name.toUpperCase() + "<br>" + album.name.toUpperCase();
            
            //COPYRIGHT
            
            
            //TRACK LENGTHS

            //PALETTE
            for (var i = 0; i < artworkColours.length; i++) {
              w.document.getElementById("paletteColour" + i).style.backgroundColor =
                artworkColours[i];
              console.log(artworkColours[i]);
            }
            
            //TRACKS
            //tracks
          });
        });
      }
    );
  });
});

function getImageColourPalette(image) {
  var vibrant = new Vibrant(image);
  var swatches = vibrant.swatches();
  return swatches;
}

async function getAlbumArtwork(albumName, artistName, albumThumbnail) {
  const url =
    "https://artwork.themoshcrypt.net/api/search?keyword=" +
    encodeURIComponent(albumName);
  const response = await fetch(url);
  const data = await response.json();

  console.log("Requested " + albumName + " from " + artistName);
  var highestMatch = data.results.find(
    (album) =>
      album.collectionName.toUpperCase() == albumName.toUpperCase() &&
      album.artistName.toUpperCase() == artistName.toUpperCase()
  );

  //use image recognition to find closest match if exact match from artist/album names cannot be found
  if (highestMatch == undefined) {
    console.log("Could not find exact match, analysing album artwork");
    data.results.forEach((album) => {
      var diff = resemble(albumThumbnail)
        .compareTo(album.artworkUrl100)
        .scaleToSameSize()
        .ignoreColors()
        .onComplete(function (data) {
          album.matchPercent = 100 - data.rawMisMatchPercentage;
        });
    });
    data.results.sort((a, b) => b.matchPercent - a.matchPercent);
    highestMatch = data.results[0];
    console.log("Found match with match percent: " + highestMatch.matchPercent);
  }

  console.log("Found " + highestMatch.collectionName);

  return highestMatch.artworkUrl100
    .replace(/(.*?)\d(.*?)(.*?)thumb\//, "http://a1.mzstatic.com/us/r1000/063/")
    .replace("/100x100bb.jpg", "");
}
