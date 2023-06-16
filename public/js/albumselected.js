$(document).ready(function () {
  $(document).on("click", ".albumContainer", function () {
    let albumNumber = $(this).index();
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
          .join("<br>");
        
        console.log(album);
        
        //ALBUM DURATION
        let albumDuration = 0;
        
        for (const track of album.tracks.items) {
          albumDuration = albumDuration + track.duration_ms;
        }
        
        //HH:SS
        let albumMinutes = (albumDuration/60)/1000;
        let albumMinutesFloor = Math.floor(albumMinutes);
        let albumSeconds = Math.floor((albumMinutes - albumMinutesFloor) * 60);
        let albumDurationLength = albumMinutesFloor + ":" + albumSeconds;
        
        //PARSING DATE FROM JSON
        let albumReleaseYear = album.release_date.substr(0, 4);
        let albumReleaseMonth = album.release_date.substr(5, 7);
        let albumReleaseDay = album.release_date.substr(8, 10);
        
        let workYear = parseInt(albumReleaseYear) - 1;
        
        //ALBUM LENGTH AND RELEASE DATE/YEAR
        console.log(albumDurationLength + " " + workYear + "-" + albumReleaseYear);
        console.log("OUT NOW / " + getMonthName(parseInt(albumReleaseMonth)) + " " + albumReleaseDay + ", " + albumReleaseYear);
        console.log(getAlbumNumber(albumNumber + 1));
        
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
            
            //------ LEFT SIDE ------       
            //TRACK NAMES
            w.document.getElementById("songsTitles").innerHTML = tracks; 
            //LENGTH AND WORK YEARS
            w.document.getElementById("albumLengthAndYear").innerHTML = albumDurationLength + " " + workYear + "-" + albumReleaseYear;
            //RELEASED BY (LABEL)
            w.document.getElementById("albumReleasedByLeft").innerHTML = "RELEASED BY " + album.label.toUpperCase();
                   
            //------ RIGHT SIDE ------
            //PALETTE
            for (var i = 0; i < artworkColours.length; i++) {
              w.document.getElementById("paletteColour" + i).style.backgroundColor =
                artworkColours[i];
              console.log(artworkColours[i]);
            }         
            //RELEASED BY (ARTIST)
            w.document.getElementById("albumBy").innerHTML = "AN ALBUM BY " + album.artists[0].name.toUpperCase();       
            //SPOTIFY URL CODE
            w.document.getElementById("spotifyCode").src = "https://scannables.scdn.co/uri/plain/png/ffffff/black/256/" + album.uri;
            //RELEASE DATE
            w.document.getElementById("albumReleaseDate").innerHTML = "OUT NOW / " + getMonthName(parseInt(albumReleaseMonth)) + " " + albumReleaseDay + ", " + albumReleaseYear;
            //RELEASED BY (LABEL)
            w.document.getElementById("albumReleasedBy").innerHTML = "RELEASED BY " + album.label.toUpperCase();
            //ALBUM NUMBER
            w.document.getElementById("albumNumber").innerHTML = getAlbumNumber(albumNumber + 1);
            //ARTIST NAME
            w.document.getElementById("albumArtist").innerHTML = album.artists[0].name.toUpperCase();
            //ALBUM NAME
            w.document.getElementById("albumName").innerHTML = album.name.toUpperCase();          
          });
        });
      }
    );
  });
});

function getAlbumNumber(number) {
  let albumNumber = "";
  let lastDigit = number % 10;
  
  switch (lastDigit) {
    case 1:
      albumNumber = number + "st";
      break;
    case 2:
      albumNumber = number + "nd";
      break;
    case 3:
      albumNumber = number + "rd";
      break;
    default:
      albumNumber = number + "th";
      break;
      
  }

  return albumNumber + " STUDIO ALBUM";
}

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
}

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
