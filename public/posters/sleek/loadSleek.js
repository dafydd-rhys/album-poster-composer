import {
  cutName,
  getAlbumNumber,
  getMonthName,
  getImageColourPalette,
  convertImageToBase64
} from "../../js//utils.js";
import { getAlbumArtwork } from "../../js/api.js";

export async function loadSleek(
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
      (track) => `${cutName(track.name.toUpperCase())}`
    )
    .join("<br />");

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

      //------ LEFT SIDE ------
      // TRACK NAMES
      const songTitles = w.document.querySelector(".songTitles");
      if (songTitles) {
        let spacing = Math.floor(-0.4 * album.total_tracks + 23.8);
        songTitles.style.lineHeight = `${spacing}px`;
        songTitles.innerHTML = tracks;
      }

      //------ RIGHT SIDE ------


      // RELEASED BY (ARTIST)
      const albumBy = w.document.querySelector(".albumBy");
      if (albumBy)
        albumBy.innerHTML = `By ${album.artists[0].name}`;

      // SPOTIFY URL CODE
      const spotifyCode = w.document.querySelector(".spotifyCode");
      if (spotifyCode)
        spotifyCode.src = `https://scannables.scdn.co/uri/plain/png/ffffff/black/256/${album.uri}`;

      // RELEASED BY (DATE, LABEL, NUMBER)
      const albumRelease = w.document.querySelector(".albumRelease");
      var label = "";
      if (albumRelease) {
        label = `RELEASED BY ${album.label.toUpperCase()}`;
        albumRelease.innerHTML = `OUT NOW / ${getMonthName(
          parseInt(albumReleaseMonth)
        )} ${albumReleaseDay}, ${albumReleaseYear}<br />${label}<br />${getAlbumNumber(
          albumNumber + 1
        )}`;
      }

      // ARTIST NAME
      const albumArtist = w.document.querySelector(".albumArtist");
      if (albumArtist) {
        // ALBUM NAME
        let lines = Math.ceil(cutName(album.name).trim().length / 20);
        let margin = 10;
        if (lines < 4) {
          margin = 115 - (lines - 1) * 30;
          if (lines === 3) {
            margin += 10;
          }
        }
        if (label.length > 40) {
          margin -= 15;
        }
        albumArtist.style.marginTop = `${margin}px`;
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