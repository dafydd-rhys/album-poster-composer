import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js//utils.js";
import { getAlbumArtwork } from "../../js/api.js";

export async function loadElegant(
  album,
  albumContainer,
  albumNumber,
  htmlFile
) {
  alert(
    `${album.name}\n${album.total_tracks}\n${album.label}\n${album.release_date}\n${album.copyrights[0].text}`
  );

  const tracks = album.tracks.items
    .map(
      (track) => `${track.track_number} ${cutName(track.name.toUpperCase())}`
    )
    .join("<br />");

  // ALBUM DURATION
  let albumDuration = album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms,
    0
  );
  let albumMinutes = albumDuration / 60 / 1000;
  let albumMinutesFloor = Math.floor(albumMinutes);
  let albumSeconds = Math.floor((albumMinutes - albumMinutesFloor) * 60);
  let albumDurationLength = `${albumMinutesFloor}:${albumSeconds}`;

  // PARSING DATE FROM JSON
  let albumReleaseYear = album.release_date.substr(0, 4);

  const swatches = getImageColourPalette(
    albumContainer.children("img:first").get(0)
  );

  // Convert image URL to Base64
  const imageUrl = album.images[0].url;
  const base64Image = await convertImageToBase64(imageUrl);

  var w = window.open(htmlFile);

  if (w) {
    w.addEventListener("load", function () {
      // ARTWORK
      const albumCover = w.document.querySelector(".albumCover");
      if (albumCover) {
        albumCover.src = base64Image;
      }

      // TRACK NAMES
      const songTitles = w.document.querySelector(".songTitles");
      if (songTitles) {
        let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
        songTitles.style.lineHeight = `${spacing}px`;
        songTitles.innerHTML = tracks;
      }

      // SPOTIFY URL CODE
      const spotifyCode = w.document.querySelector(".spotifyCode");
      if (spotifyCode)
        spotifyCode.src = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;

      // RELEASED BY (DATE, LABEL, NUMBER)
      const releaseDate = w.document.querySelector(".releaseDate");
      const releaseLabel = w.document.querySelector(".releaseDate");
      const albumLength = w.document.querySelector(".releaseDate");
      
      releaseDate.innerHTML = albumReleaseYear;
      releaseLabel.innerHTML = album.label;
      albumLength.innerHTML = albumDurationLength;

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        albumArtist.innerHTML = album.artists[0].name.toUpperCase();
        const albumName = w.document.querySelector(".albumName");
        if (albumName)
          albumName.innerHTML = cutName(album.name.toUpperCase()).trim();
      }
      
      // PALETTE
      for (var i = 0; i < 5; i++) {
        const paletteColour = w.document.querySelector(`.paletteColour${i}`);
        if (paletteColour) {
          // Create a canvas element
          var canvas = document.createElement("canvas");
          canvas.width = 46;
          canvas.height = 48;
          // Get the canvas context
          var context = canvas.getContext("2d");
          // Set the fill color to rgb of swatch
          context.fillStyle = `rgb(${swatches[i][0]}, ${swatches[i][1]}, ${swatches[i][2]})`;
          // Fill the entire canvas with color
          context.fillRect(0, 0, canvas.width, canvas.height);
          paletteColour.src = canvas.toDataURL("image/png");
        }
      }
    });
  } else {
    console.error("Failed to open the new window.");
  }
}